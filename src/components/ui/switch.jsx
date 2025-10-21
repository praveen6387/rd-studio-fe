"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(({ className, size = "default", ...props }, ref) => {
  const switchSize = size === "sm" ? "h-3 w-7" : "h-5 w-9";
  const thumbSize =
    size === "sm" ? "h-2 w-2 data-[state=checked]:translate-x-4" : "h-4 w-4 data-[state=checked]:translate-x-4";

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        switchSize,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
          thumbSize
        )}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
