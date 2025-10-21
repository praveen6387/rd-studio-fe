// "use client";

// import { Input } from "./input";

// const DataTableFilter = ({ table, column }) => {
//   return (
//     <Input
//       placeholder="Search..."
//       value={table.getColumn(column)?.getFilterValue() ?? ""}
//       onChange={(event) => table.getColumn(column)?.setFilterValue(event.target.value)}
//       className="max-w-sm"
//     />
//   );
// };

// export default DataTableFilter;

"use client";

import { useEffect } from "react";
import { Input } from "./input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DataTableFilter = ({ table, column, placeholder }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q) {
      const current = table.getColumn(column)?.getFilterValue() ?? "";
      if (current !== q) table.getColumn(column)?.setFilterValue(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateUrlQuery = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim().length > 0) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    table.getColumn(column)?.setFilterValue(value);
    updateUrlQuery(value);
  };

  return (
    <Input
      placeholder={placeholder || "Search..."}
      value={table.getColumn(column)?.getFilterValue() ?? ""}
      onChange={handleInputChange}
      className="max-w-sm"
    />
  );
};

export default DataTableFilter;
