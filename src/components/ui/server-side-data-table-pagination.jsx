"use client";

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const ServerSideDataTablePagination = ({ table, hasFilter, setPaginationLoader }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value, key) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key == "page_size") {
        params.delete("page_index");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (value) => {
    setPaginationLoader(true);
    const queryString = createQueryString(value, "page_index");
    if (queryString) {
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.replace(pathname);
    }
  };

  const handelPageSizeChange = (value) => {
    setPaginationLoader(true);
    const queryString = createQueryString(value, "page_size");
    if (queryString) {
      router.replace(`${pathname}?${queryString}`);
    } else {
      router.replace(pathname);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div></div>
      <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              handelPageSizeChange(value);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFilter && (
          <div className="items-center justify-center text-sm font-medium hidden md:flex">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        )}
        <div className="flex items-center space-x-2">
          {hasFilter && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                table.setPageIndex(0);
                handlePageChange(1);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4 " />
            </Button>
          )}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.previousPage();
              handlePageChange(table.getState().pagination.pageIndex);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              table.nextPage();
              handlePageChange(table.getState().pagination.pageIndex + 2);
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          {hasFilter && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
                handlePageChange(table.getPageCount());
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerSideDataTablePagination;
