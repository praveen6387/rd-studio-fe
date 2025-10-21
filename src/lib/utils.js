import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const convertTime = (utcTimestamp) => {
  const utcDate = new Date(utcTimestamp);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Get individual date components
  const day = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit" });
  const month = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", month: "short" });
  const year = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", year: "numeric" });
  const time = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Construct consistent date string
  return `${day} ${month} ${year}, ${time}`;
};

export const convertToDate = (utcTimestamp) => {
  const utcDate = new Date(utcTimestamp);
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const indianDate = new Intl.DateTimeFormat("en-IN", options).format(utcDate);
  return indianDate;
};

export const formatToLakhCrore = (value) => {
  // Return empty string for null/undefined, but handle 0 properly
  if (value === null || value === undefined || !value) return "0.00";

  // Convert to number if it's not already
  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) return "0.00";

  if (numValue >= 1_00_00_000) {
    return `${Math.floor((numValue / 1_00_00_000) * 100) / 100} Cr`;
  } else if (numValue >= 1_00_000) {
    return `${Math.floor((numValue / 1_00_000) * 100) / 100} Lac`;
  } else if (numValue >= 1_000) {
    return `${Math.floor((numValue / 1_000) * 100) / 100}K`;
  } else {
    // For very small numbers, simply format with 2 decimal places
    return numValue.toFixed(2);
  }
};

export const formatDateToYYYYMMDD = (utcTimestamp) => {
  if (!utcTimestamp) return ""; // Handle undefined or null input gracefully

  // Parse the UTC date string
  const utcDate = new Date(utcTimestamp);

  // Extract year, month, and day
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(utcDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDecimalToTwoDecimals = (value) => {
  if (value == null) return value;

  // Convert value to a number if it's not already
  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) return value;

  const formatted = numValue.toFixed(2);
  // Check if the number is a whole number (ends with .00)
  return formatted.endsWith(".00") ? parseInt(formatted) : formatted;
};

export const formatToLakh = (value, decimalPlaces = 2) => {
  // Return empty string for null/undefined, but handle 0 properly
  if (value === null || value === undefined || !value) return "0.00";

  // Convert to number if it's not already
  const numValue = Number(value);

  // Check if it's a valid number
  if (isNaN(numValue)) return "0.00";

  if (numValue < 1000 && numValue > -1000) {
    return numValue.toFixed(decimalPlaces);
  }

  // Always convert to lakh format
  const lakhValue = numValue / 1_00_000; // Convert to lakh (divide by 100000)

  // Format with 2 decimal places and add "Lac" suffix
  const final_value = lakhValue.toFixed(decimalPlaces);
  return final_value == 0.0 ? "0.00" : `${final_value} Lac`;
};

export const formatToThousand = (value, decimalPlaces = 2) => {
  if (value >= 1000 || value <= -1000) return `${(value / 1000).toFixed(decimalPlaces)}k`;
  return `${value}`;
};

export const formatPercentage = (value) => {
  if (!value && value !== 0) return "0.00%";
  return `${parseFloat(value).toFixed(2)}%`;
};
