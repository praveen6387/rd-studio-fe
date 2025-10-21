"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";

import { CalendarDays, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

const DateRangeColumnFilter = ({
  column,
  setAddedFilters,
  openFilterDropdown,
  setOpenFilterDropdown,
  currentFilterValue,
}) => {
  const columnFilterValue = useMemo(() => {
    const value = currentFilterValue !== undefined ? currentFilterValue : column.getFilterValue() || {};
    return value;
  }, [column, currentFilterValue]);
  const [startDate, setStartDate] = useState(
    columnFilterValue.startDate ? new Date(columnFilterValue.startDate) : undefined
  );
  const [endDate, setEndDate] = useState(columnFilterValue.endDate ? new Date(columnFilterValue.endDate) : undefined);

  useEffect(() => {
    setStartDate(columnFilterValue.startDate ? new Date(columnFilterValue.startDate) : undefined);
    setEndDate(columnFilterValue.endDate ? new Date(columnFilterValue.endDate) : undefined);
  }, [columnFilterValue]);

  const applyFilter = useCallback(() => {
    if (startDate || endDate) {
      column.setFilterValue({
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
      });
    } else {
      column.setFilterValue(undefined);
    }
    setOpenFilterDropdown("");
  }, [startDate, endDate, column, setOpenFilterDropdown]);

  const clearFilter = useCallback(
    (e) => {
      e.stopPropagation();
      setStartDate(undefined);
      setEndDate(undefined);
      column.setFilterValue(undefined);
      setAddedFilters((prev) => prev.filter((col) => col.id !== column.id));
    },
    [column, setAddedFilters]
  );

  const formatDateForDisplay = useCallback((dateStr) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  }, []);

  const isActive = columnFilterValue.startDate || columnFilterValue.endDate;

  const getDisplayText = useCallback(() => {
    if (columnFilterValue.startDate && columnFilterValue.endDate) {
      return `${formatDateForDisplay(columnFilterValue.startDate)} - ${formatDateForDisplay(
        columnFilterValue.endDate
      )}`;
    } else if (columnFilterValue.startDate) {
      return `From ${formatDateForDisplay(columnFilterValue.startDate)}`;
    } else if (columnFilterValue.endDate) {
      return `Until ${formatDateForDisplay(columnFilterValue.endDate)}`;
    }
    return "All";
  }, [columnFilterValue, formatDateForDisplay]);

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
            className="border-dashed flex items-center gap-2 md:max-w-[calc(100vw-270px)] max-w-[calc(100vw-70px)]"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              {column.columnDef.header}: {getDisplayText()}
            </span>
            <X width={14} height={14} className="invisible flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        {isActive && (
          <X width={14} height={14} onClick={clearFilter} className="absolute top-[9px] right-3 cursor-pointer" />
        )}
      </div>

      <DropdownMenuContent className="w-80" align="start">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filter by Date Range</h4>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Start Date</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => {
                      if (endDate && date > endDate) return true;
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">End Date</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick an end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => {
                      if (startDate && date < startDate) return true;
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpenFilterDropdown("")}>
              Cancel
            </Button>
            <Button size="sm" onClick={applyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateRangeColumnFilter;
