import React from "react";
import { Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Tag = ({
  text,
  bgColor,
  textColor,
  showDot,
  dotColor,
  borderTag,
  borderColor,
  dotBorder,
  borderTagStyle,
  className = "",
  textClassName = "",
  showLoader,
}) => {
  const tagStyle = {
    backgroundColor: bgColor,
    color: textColor,
    border: borderTag,
    borderColor: borderColor,
    borderStyle: borderTagStyle,
  };

  const dotStyle = {
    fill: dotColor,
    color: dotBorder,
  };

  return (
    <div className={cn("flex gap-x-1 w-fit h-fit px-1 py-0 items-center rounded-md", className)} style={tagStyle}>
      {showDot && <Circle className={`h-2 w-2`} style={dotStyle} />}
      {showLoader && <Loader2 className="h-3 w-3 animate-spin" />}
      <p className={cn("text-[10px] font-medium text-nowrap capitalize", textClassName)}>{text}</p>
    </div>
  );
};

export default Tag;
