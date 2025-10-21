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
// import DataTableColumnToggle from "./data-table-col-toggle";
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
import { Search } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { Input } from "./input";
import ServerSideDataTablePagination from "./server-side-data-table-pagination";
// import { FilterX } from "lucide-react";

const AddColumnFilter = ({ columns, addedFilters, setAddedFilters, setOpenFilterDropdown, inline = false }) => {
  if (columns.length > 0)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {inline ? (
            <Button size="sm" variant="link" className="ml-2 px-0 text-slate-700 focus-visible:ring-0">
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
              {column.columnDef.header}: {columnFilterValue.length > 0 ? columnFilterValue.join(", ") : "All"}
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

const ServerSideDataTable = ({
  data,
  columns,
  filter,
  highlighted_column_name = "",
  customAction = null,
  hiddenCols = {},
  rowCount,
  pagination,
  setPagination,
  paginationLoader = false,
  hasFilter,
  setPaginationLoader,
  colorCodeColumn = "",
  hasView = false,
}) => {
  const [sorting, setSorting] = useState();
  const [columnFilters, setColumnFilters] = useState();
  const [columnVisibility, setColumnVisibility] = useState();
  const [rowSelection, setRowSelection] = useState();
  const [addedFilters, setAddedFilters] = useState([]);
  const [openFilterDropdown, setOpenFilterDropdown] = useState("");

  const getRowBackgroundColor = (row, index) => {
    if (!colorCodeColumn || !data.length) return "";

    if (addedFilters.length > 0 || sorting?.length > 0) return "";

    const currentValue = row[colorCodeColumn];

    const uniqueValues = new Set();
    let groupNumber = 0;

    for (let i = 0; i <= index; i++) {
      const value = table.getRowModel().rows[i].original[colorCodeColumn];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        if (value === currentValue) {
          groupNumber = uniqueValues.size - 1;
        }
      }
    }

    const colors = ["bg-[#f5f7ff]", "bg-[#fef6f9]", "bg-[#f6fdf9]", "bg-[#fcfaff]"];

    return `${colors[groupNumber % 4]} hover:bg-white`;
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // autoResetPageIndex: true,
    manualFiltering: true,
    onPaginationChange: setPagination,
    rowCount: rowCount,
    manualPagination: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnVisibility: hiddenCols,
    },
  });

  return (
    <div className="w-full">
      <div className={`flex items-center justify-between gap-2 ${hasView ? "" : "pb-4"}`}>
        <div className="flex flex-col gap-4 w-full">
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
                className="ml-2 px-0 text-slate-700 outline-none"
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

        <div className="flex items-center gap-2">
          {customAction}
          {/* <DataTableColumnToggle table={table} /> */}
        </div>
      </div>

      <div className={`rounded-b-md border ${hasView ? "" : "rounded-t-md"}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs" colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center text-nowrap justify-between border-r pr-4 gap-1",
                            header.column.getCanSort() ? "cursor-pointer select-none" : ""
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
            {paginationLoader ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[200px]">
                  <LoaderCircle className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} className={getRowBackgroundColor(row.original, index)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="relative p-2.5">
                      <div className="flex gap-2 items-center">
                        {cell.column.id === highlighted_column_name && row.original.newlyAdded && (
                          <span className="absolute top-0 bottom-0 left-0 border-[1.5px] border-slate-900"></span>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
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
      </div>

      <ServerSideDataTablePagination table={table} hasFilter={hasFilter} setPaginationLoader={setPaginationLoader} />
    </div>
  );
};

export default ServerSideDataTable;
