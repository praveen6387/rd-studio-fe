"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const FileUpload = React.forwardRef(({ onChange, value, ...props }, ref) => {
  const internalInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (value && value.name) {
      setFileName(value.name);
    } else {
      setFileName("");
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onChange) {
        onChange(file);
      }
    } else {
      setFileName("");
      if (onChange) {
        onChange(null);
      }
    }
  };

  const setRefs = (node) => {
    internalInputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-9 border-2 border-dashed rounded-md cursor-pointer text-sm",
        "hover:bg-muted"
      )}
      onClick={() => internalInputRef.current?.click()}
    >
      <input
        type="file"
        ref={setRefs}
        className="hidden"
        onChange={handleFileChange}
        {...props}
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      {fileName ? (
        <span className="text-muted-foreground">{fileName}</span>
      ) : (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <UploadIcon />
          <span className="">Upload CSV</span>
        </div>
      )}
    </div>
  );
});
FileUpload.displayName = "FileUpload";
export { FileUpload };
