"use client";
import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataTablePagination from "./data-table-pagination";
import DataTableFilter from "./data-table-filter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { X } from "lucide-react";
import { Filter } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";

const AddColumnFilter = ({ columns, addedFilters, setAddedFilters, setOpenFilterDropdown, inline = false }) => {
  if (columns.length > 0)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {inline ? (
            <Button size="sm" variant="link" className="ml-2 px-0 text-slate-700 focus-visible:ring-0 underline">
              Add Filters
            </Button>
          ) : (
            <Button variant="outline" className="border-dashed flex items-center gap-1.5 text-slate-600">
              Filter
              <Filter width={15} height={15} />
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

      <DropdownMenuContent className="w-56" align="start">
        <div className="max-h-[300px] overflow-y-auto">
          {sortedUniqueValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={columnFilterValue.includes(value)}
              onCheckedChange={() => toggleValue(value)}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DataTable = ({
  data,
  columns,
  filter,
  highlighted_column_name = "",
  customAction = null,
  hiddenCols = {},
  placeholder = null,
  enablePagination = true,
  showSearchBar = true,
  cellStyle = "",
  tableFooter = null,
  alignTop = false,
}) => {
  const [sorting, setSorting] = useState();
  const [columnFilters, setColumnFilters] = useState();
  const [columnVisibility, setColumnVisibility] = useState();
  const [rowSelection, setRowSelection] = useState();
  const [addedFilters, setAddedFilters] = useState([]);
  const [openFilterDropdown, setOpenFilterDropdown] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnVisibility: hiddenCols,
    },
  });

  return (
    <>
      <div className="flex items-end justify-between gap-2 pb-4 flex-wrap">
        <div className="flex flex-col gap-4 w-[500px]">
          <div className="flex items-center gap-4">
            {showSearchBar && <DataTableFilter table={table} column={filter} placeholder={placeholder} />}
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

      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={header.id} className="text-xs text-nowrap" colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center justify-between pr-4 gap-1",
                            header.column.getCanSort() ? "cursor-pointer select-none" : "",
                            index === headerGroup.headers.length - 1 ? "border-r-0" : "border-r"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {header.column.getCanSort() && (
                            <>
                              {{
                                asc: <ChevronUp width={13} height={13} />,
                                desc: <ChevronDown width={13} height={13} />,
                              }[header.column.getIsSorted()] ?? <ChevronsUpDown width={13} height={13} />}
                            </>
                          )}
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const dynamicCellStyle = typeof cellStyle === "function" ? cellStyle({ row }) : cellStyle;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`relative ${dynamicCellStyle} ${alignTop ? "align-top pb-6 pt-2" : "align-middle"}`}
                      >
                        <div className="flex gap-2 items-center">
                          {cell.column.id === highlighted_column_name && row.original.newlyAdded && (
                            <span className="absolute top-0 bottom-0 left-0 border-[1.5px] border-slate-900"></span>
                          )}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  })}
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

          {tableFooter}
        </Table>
      </div>

      {enablePagination && <DataTablePagination table={table} />}
    </>
  );
};

export default DataTable;
