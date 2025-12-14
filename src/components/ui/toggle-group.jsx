"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
  value: undefined,
  onValueChange: undefined,
});

const ToggleGroup = React.forwardRef(({ className, variant, size, value, onValueChange, children, ...props }, ref) => {
  return (
    <div ref={ref} role="group" className={cn("flex items-center justify-center gap-1", className)} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size, value, onValueChange }}>
        {children}
      </ToggleGroupContext.Provider>
    </div>
  );
});

ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, value, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const isOn = context?.value === value;
  const handleClick = (e) => {
    props?.onClick?.(e);
    if (context?.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isOn}
      data-state={isOn ? "on" : "off"}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
