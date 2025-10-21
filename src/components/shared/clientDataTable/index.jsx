"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "./_builder/Pagination";
import Filter from "./_builder/Filter";
import DateRangeColumnFilter from "./_builder/DateRangeColumnFilter";
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
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";

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

const ColumnFilter = ({ column, setAddedFilters, openFilterDropdown, setOpenFilterDropdown, urlState }) => {
  const filterVariant = column?.columnDef?.meta?.filterVariant;
  const columnFilterValue = column?.getFilterValue ? column.getFilterValue() : null;

  const filterValue = useMemo(() => {
    if (!column || !column.columnDef || !column.columnDef.meta) return [];

    if (filterVariant === "date-range" && column?.accessorKey) {
      const paramKey = column.accessorKey.replace(/_/g, "-");
      const paramValue = urlState?.[paramKey];
      if (paramValue) {
        const [startDate, endDate] = paramValue.split(",");
        return {
          startDate: startDate || null,
          endDate: endDate || null,
        };
      }
      return {};
    }
    return columnFilterValue || [];
  }, [columnFilterValue, filterVariant, urlState, column]);

  const sortedUniqueValues = useMemo(() => {
    if (!column || filterVariant === "date-range") return [];
    if (!column?.getFacetedUniqueValues) return [];
    return Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000);
  }, [column, filterVariant]);

  const toggleValue = useCallback(
    (value) => {
      if (!column?.setFilterValue) return;

      const safeFilterValue = Array.isArray(filterValue) ? filterValue : [];
      const updatedValues = safeFilterValue.includes(value)
        ? safeFilterValue.filter((v) => v !== value)
        : [...safeFilterValue, value];

      column.setFilterValue(updatedValues);
    },
    [column, filterValue]
  );

  const formatDateForDisplay = useCallback((dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return dateStr;
    }
  }, []);

  const getFilterDisplayText = useCallback(() => {
    if (filterVariant === "date-range") {
      if (filterValue.startDate && filterValue.endDate) {
        return `${formatDateForDisplay(filterValue.startDate)} - ${formatDateForDisplay(filterValue.endDate)}`;
      } else if (filterValue.startDate) {
        return `From ${formatDateForDisplay(filterValue.startDate)}`;
      } else if (filterValue.endDate) {
        return `Until ${formatDateForDisplay(filterValue.endDate)}`;
      }
      return "All";
    } else {
      const safeFilterValue = Array.isArray(filterValue) ? filterValue : [];
      return safeFilterValue.length > 0
        ? safeFilterValue.length > 3
          ? safeFilterValue[0] + ` + ${safeFilterValue.length - 1} more`
          : safeFilterValue.join(", ")
        : "All";
    }
  }, [filterVariant, filterValue, formatDateForDisplay]);

  if (!column || !column.columnDef || !column.columnDef.meta) {
    return null;
  }

  if (filterVariant === "date-range") {
    return (
      <DateRangeColumnFilter
        column={column}
        setAddedFilters={setAddedFilters}
        openFilterDropdown={openFilterDropdown}
        setOpenFilterDropdown={setOpenFilterDropdown}
        currentFilterValue={filterValue}
      />
    );
  }

  return (
    <DropdownMenu
      open={openFilterDropdown === column.id}
      onOpenChange={(open) => {
        if (!open) {
          setOpenFilterDropdown("");
        }
      }}
    >
      <div className="relative flex items-center gap-1 text-slate-700">
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-dashed flex items-center gap-2 md:max-w-[calc(100vw-270px)] max-w-[calc(100vw-70px)]"
            onClick={() => setOpenFilterDropdown(column.id)}
          >
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              {column.columnDef.header}: {getFilterDisplayText()}
            </span>
            <X width={14} height={14} className="invisible flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <X
          width={14}
          height={14}
          onClick={(e) => {
            e.stopPropagation();
            column.setFilterValue(filterVariant === "date-range" ? undefined : []);
            setAddedFilters((prev) => prev.filter((col) => col.id !== column.id));
          }}
          className="absolute top-[9px] right-3 cursor-pointer"
        />
      </div>

      <DropdownMenuContent align="start" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="max-h-[300px] overflow-y-auto">
          {sortedUniqueValues.map(
            (value) =>
              value && (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={Array.isArray(filterValue) && filterValue.includes(value)}
                  onCheckedChange={() => toggleValue(value)}
                  onSelect={(e) => e.preventDefault()}
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

const DataTable = ({
  data = [],
  columns = [],
  searchableColumns = [],
  customAction = null,
  hiddenCols = {},
  loading = false,
  footer = null,
  showFooterWhenFiltered = false,
  showFilter = true,
}) => {
  const queryParams = {
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  };

  columns.forEach((col) => {
    if (col.meta?.filterVariant && col.accessorKey) {
      const paramKey = col.accessorKey.replace(/_/g, "-");
      if (col.meta.filterVariant === "date-range") {
        queryParams[paramKey] = parseAsString.withDefault("");
      } else {
        queryParams[paramKey] = parseAsString.withDefault("");
      }
    }
  });

  const [urlState, setUrlState] = useQueryStates(queryParams, { shallow: true, clearOnDefault: true });

  const [columnVisibility, setColumnVisibility] = useState(hiddenCols);
  const [rowSelection, setRowSelection] = useState({});
  const [addedFilters, setAddedFilters] = useState([]);
  const [openFilterDropdown, setOpenFilterDropdown] = useState("");

  const columnFilters = useMemo(() => {
    const filters = [];
    columns.forEach((col) => {
      if (col.meta?.filterVariant && col.accessorKey) {
        const paramKey = col.accessorKey.replace(/_/g, "-");
        const paramValue = urlState[paramKey];

        if (paramValue) {
          if (col.meta.filterVariant === "date-range") {
            const [startDate, endDate] = paramValue.split(",");
            filters.push({
              id: col.accessorKey,
              value: {
                startDate: startDate || null,
                endDate: endDate || null,
              },
            });
          } else {
            const values = paramValue.split(",").filter((v) => v.trim() !== "");
            filters.push({
              id: col.accessorKey,
              value: values,
            });
          }
        }
      }
    });
    return filters;
  }, [columns, urlState]);

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

  const multiValueFilterFn = (row, columnId, filterValue) => {
    if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) return true;
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;
    return filterValue.includes(String(cellValue));
  };

  const processedColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.meta?.filterVariant && col.meta.filterVariant !== "date-range") {
        return {
          ...col,
          filterFn: "multiValue",
        };
      }
      return col;
    });
  }, [columns]);

  const table = useReactTable({
    data,
    columns: processedColumns,
    onColumnFiltersChange: (updaterOrValue) => {
      const newFilters = typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;

      const updates = { page: 1 };

      columns.forEach((col) => {
        if (col.meta?.filterVariant && col.accessorKey) {
          const paramKey = col.accessorKey.replace(/_/g, "-");
          updates[paramKey] = null;
        }
      });

      if (Array.isArray(newFilters)) {
        newFilters.forEach((filter) => {
          const column = columns.find((col) => col.accessorKey === filter.id);

          if (column?.meta?.filterVariant) {
            const paramKey = filter.id.replace(/_/g, "-");

            if (column.meta.filterVariant === "date-range" && filter.value) {
              const startDate = filter.value.startDate || "";
              const endDate = filter.value.endDate || "";
              if (startDate || endDate) {
                updates[paramKey] = `${startDate},${endDate}`;
              }
            } else if (filter.value && Array.isArray(filter.value) && filter.value.length > 0) {
              updates[paramKey] = filter.value.join(",");
            }
          }
        });
      }

      setUrlState(updates);
    },
    onGlobalFilterChange: (search) => {
      setUrlState({
        search: search || null,
        page: 1,
      });
    },
    onPaginationChange: (pagination) => {
      if (typeof pagination === "function") {
        const newPagination = pagination({
          pageIndex: urlState.page - 1,
          pageSize: urlState.pageSize,
        });
        setUrlState({
          page: newPagination.pageIndex + 1,
          pageSize: newPagination.pageSize,
        });
      }
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: globalFilterFn,
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      multiValue: multiValueFilterFn,
    },
    autoResetPageIndex: false,
    state: {
      globalFilter: urlState.search,
      pagination: {
        pageIndex: urlState.page - 1,
        pageSize: urlState.pageSize,
      },
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const filterableColumns = useMemo(() => {
    return table
      .getAllColumns()
      .filter((col) => col.getCanFilter() && col.columnDef.meta && col.columnDef.meta.filterVariant);
  }, [table]);

  const customSelectColumns = useMemo(() => {
    return filterableColumns.filter((col) => col.columnDef.meta.filterVariant === "custom-select");
  }, [filterableColumns]);

  useEffect(() => {
    const activeFilters = filterableColumns.filter((col) => {
      const filterValue = col.getFilterValue();
      if (col.columnDef.meta.filterVariant === "date-range") {
        return filterValue && (filterValue.startDate || filterValue.endDate);
      }
      return filterValue && Array.isArray(filterValue) && filterValue.length > 0;
    });
    setAddedFilters(activeFilters);
  }, [urlState, filterableColumns]);

  const resetFilters = useCallback(() => {
    const updates = { search: null, page: 1 };

    columns.forEach((col) => {
      if (col.meta?.filterVariant && col.accessorKey) {
        const paramKey = col.accessorKey.replace(/_/g, "-");
        updates[paramKey] = null;
      }
    });

    setUrlState(updates);
    setAddedFilters([]);
  }, [setUrlState, columns]);

  return (
    <>
      <div className="flex items-end justify-between gap-2 pb-4 flex-wrap">
        <div className="flex flex-col gap-4 w-[500px]">
          <div className="flex items-center gap-4">
            {showFilter && <Filter table={table} disabled={loading} placeholder="Search..." showSearchIcon={true} />}
            <AddColumnFilter
              columns={filterableColumns}
              addedFilters={addedFilters}
              setAddedFilters={setAddedFilters}
              setOpenFilterDropdown={setOpenFilterDropdown}
            />
          </div>

          {addedFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {addedFilters.map((col) => (
                <ColumnFilter
                  key={col.id}
                  column={col}
                  setAddedFilters={setAddedFilters}
                  openFilterDropdown={openFilterDropdown}
                  setOpenFilterDropdown={setOpenFilterDropdown}
                  urlState={urlState}
                />
              ))}

              <AddColumnFilter
                columns={customSelectColumns}
                addedFilters={addedFilters}
                setAddedFilters={setAddedFilters}
                setOpenFilterDropdown={setOpenFilterDropdown}
                inline={true}
              />

              <Button
                size="sm"
                variant="link"
                className="ml-2 px-0 text-slate-700 outline-none underline"
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
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
                          <div
                            className={cn(
                              "flex items-center justify-between mt-6 pl-2 pr-4 gap-4",
                              !isLastColumn && "border-r",
                              header.column.getCanSort() ? "cursor-pointer select-none" : ""
                            )}
                            onClick={header.column.getToggleSortingHandler()}
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
            {footer && showFooterWhenFiltered && (urlState.search || columnFilters.length > 0) && (
              <TableRow className="bg-slate-50 font-medium border-t-2">
                {(typeof footer === "function"
                  ? footer(table.getRowModel().rows.map((row) => row.original))
                  : footer
                )?.map((cell, index) => (
                  <TableCell key={index} className="p-3 align-top">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Backdrop blur overlay for table only */}
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none",
            loading ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Loader centered in viewport */}
        <div
          className={cn(
            "fixed inset-0 flex justify-center items-center transition-opacity duration-300 pointer-events-none z-50",
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

export default DataTable;
