"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Filter = ({ table, disabled = false, placeholder = "Search...", className, showSearchIcon = false }) => {
  const value = table.getState().globalFilter ?? "";

  const handleChange = (event) => {
    const inputValue = event.target.value;
    table.setGlobalFilter(inputValue);
  };

  return (
    <div className="relative">
      {showSearchIcon && (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={cn("max-w-sm", showSearchIcon && "pl-10", className)}
        disabled={disabled}
      />
    </div>
  );
};

export default Filter;
