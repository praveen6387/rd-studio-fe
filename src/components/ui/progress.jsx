"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value = 0, bgColor = "#10172A", ...props }, ref) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <div
        className="h-full transition-all"
        style={{ width: `${clamped}%`, backgroundColor: bgColor }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
