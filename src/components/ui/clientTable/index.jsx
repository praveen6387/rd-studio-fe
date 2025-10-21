"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon, Loader2, X } from "lucide-react";
import Filter from "./_builder/Filter";
import Pagination from "./_builder/Pagination";

const AddColumnFilter = ({
  columns,
  addedFilters,
  setAddedFilters,
  setOpenFilterDropdown,
  inline = false,
  disabled,
}) => {
  if (columns.length > 0)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled} asChild>
          {inline ? (
            <Button size="sm" variant="link" className="ml-2 px-0 text-slate-700 focus-visible:ring-0 underline">
              Add Filters
            </Button>
          ) : (
            <Button variant="outline" className="border-dashed flex items-center gap-1.5 text-slate-600">
              Filter
              <FilterIcon width={15} height={15} />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {columns.map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={addedFilters.find((filter) => filter.id === col.id) ? true : false}
              onCheckedChange={() => {
                if (addedFilters.find((filter) => filter.id === col.id)) {
                  setAddedFilters((prev) => prev.filter((prevCol) => prevCol.id !== col.id));
                  col.setFilterValue([]);
                } else {
                  setAddedFilters((prev) => [...prev, col]);
                  setOpenFilterDropdown(col.id);
                }
              }}
            >
              {col.columnDef.header}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

const ColumnFilter = ({ column, setAddedFilters, openFilterDropdown, setOpenFilterDropdown }) => {
  const columnFilterValue = column.getFilterValue() || [];
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()]
  );

  const toggleValue = (value) => {
    const updatedValues = columnFilterValue.includes(value)
      ? columnFilterValue.filter((v) => v !== value)
      : [...columnFilterValue, value];

    column.setFilterValue(updatedValues);
  };

  return (
    <DropdownMenu
      open={openFilterDropdown === column.id}
      onOpenChange={() =>
        openFilterDropdown === column.id ? setOpenFilterDropdown("") : setOpenFilterDropdown(column.id)
      }
    >
      <div className="relative flex items-center gap-1 text-slate-700">
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-dashed flex items-center gap-2 md:max-w-[calc(100vw-270px)] max-w-[calc(100vw-70px)] "
          >
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              {column.columnDef.header}:{" "}
              {columnFilterValue.length > 0
                ? columnFilterValue.length > 3
                  ? columnFilterValue[0] + ` + ${columnFilterValue.length - 1} more`
                  : columnFilterValue.join(", ")
                : "All"}
            </span>
            <X width={14} height={14} className="invisible flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <X
          width={14}
          height={14}
          onClick={(e) => {
            e.stopPropagation();
            column.setFilterValue([]);
            setAddedFilters((prev) => prev.filter((col) => col.id !== column.id));
          }}
          className="absolute top-[9px] right-3 cursor-pointer"
        />
      </div>

      <DropdownMenuContent className="w-56">
        <div className="max-h-[300px] overflow-y-auto">
          {sortedUniqueValues.map(
            (value) =>
              value && (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={columnFilterValue.includes(value)}
                  onCheckedChange={() => toggleValue(value)}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              )
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ClientDataTable = ({
  data,
  columns,
  searchableColumns = [],
  customAction = null,
  hiddenCols = {},
  loading = false,
  pushUrlSearchParam = true,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [addedFilters, setAddedFilters] = useState([]);
  const [openFilterDropdown, setOpenFilterDropdown] = useState("");

  const globalFilterFn = (row, columnId, value) => {
    if (!value) return true;

    const searchValue = value.toLowerCase();

    if (searchableColumns.length > 0) {
      return searchableColumns.some((columnKey) => {
        const cellValue = row.getValue(columnKey);
        return cellValue ? String(cellValue).toLowerCase().includes(searchValue) : false;
      });
    }

    return Object.values(row.original).some((cellValue) => {
      if (cellValue == null) return false;
      return String(cellValue).toLowerCase().includes(searchValue);
    });
  };

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: globalFilterFn,
    autoResetPageIndex: false,
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      columnVisibility: hiddenCols,
    },
  });

  const updateSearchParams = useCallback(
    (searchValue) => {
      const params = new URLSearchParams(searchParams);

      if (searchValue && searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setGlobalFilter(searchQuery);
  }, [searchParams]);

  useEffect(() => {
    if (pushUrlSearchParam) {
      updateSearchParams(globalFilter);
    }
  }, [globalFilter, updateSearchParams, pushUrlSearchParam]);

  useEffect(() => {
    if ((columnFilters && columnFilters.length) || globalFilter) {
      table.setPageIndex(0);
    }
  }, [columnFilters, globalFilter, table]);

  return (
    <>
      <div className="flex items-end justify-between gap-2 pb-4 flex-wrap">
        <div className="flex flex-col gap-4 w-[500px]">
          <div className="flex items-center gap-4">
            <Filter table={table} disabled={loading} placeholder="Search..." showSearchIcon={true} />
            <AddColumnFilter
              columns={table
                .getAllColumns()
                .filter(
                  (col) =>
                    col.getCanFilter() &&
                    col.columnDef.meta &&
                    col.columnDef.meta.filterVariant &&
                    col.columnDef.meta.filterVariant === "custom-select"
                )}
              addedFilters={addedFilters}
              setAddedFilters={setAddedFilters}
              setOpenFilterDropdown={setOpenFilterDropdown}
            />
          </div>

          {addedFilters.length > 0 ? (
            <div className="flex items-center gap-2 flex-wrap">
              {addedFilters.map((col) => (
                <ColumnFilter
                  key={col.id}
                  column={col}
                  setAddedFilters={setAddedFilters}
                  openFilterDropdown={openFilterDropdown}
                  setOpenFilterDropdown={setOpenFilterDropdown}
                />
              ))}

              <AddColumnFilter
                columns={table
                  .getAllColumns()
                  .filter(
                    (col) =>
                      col.getCanFilter() &&
                      col.columnDef.meta &&
                      col.columnDef.meta.filterVariant &&
                      col.columnDef.meta.filterVariant === "custom-select"
                  )}
                addedFilters={addedFilters}
                setAddedFilters={setAddedFilters}
                setOpenFilterDropdown={setOpenFilterDropdown}
                inline={true}
              />

              <Button
                size="sm"
                variant="link"
                className="ml-2 px-0 text-slate-700 outline-none underline"
                onClick={() => {
                  setAddedFilters([]);
                  table.resetColumnFilters();
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 flex-wrap">{customAction}</div>
      </div>

      <div className="rounded-md border w-full relative overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isLastColumn = index === headerGroup.headers.length - 1;
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="bg-slate-50 p-0 h-8">
                      {header.isPlaceholder ? null : (
                        <div className="h-full">
                          <div className={cn("flex items-center mt-6 pl-2 pr-4 gap-4", !isLastColumn && "border-r")}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent border-b border-slate-200">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none",
            loading ? "opacity-100" : "opacity-0"
          )}
        >
          <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
        </div>
      </div>

      <Pagination table={table} />
    </>
  );
};

export default ClientDataTable;
