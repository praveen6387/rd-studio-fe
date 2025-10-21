"use client";
import { useState, forwardRef, useEffect, useRef } from "react";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { CircleFlag } from "react-circle-flags";
import { countries } from "country-data-list";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { GlobeIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";

export const phoneSchema = z.string().refine((value) => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
}, "Invalid phone number");

const allCountries = countries.all
  .filter((country) => country.countryCallingCodes && country.countryCallingCodes.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name));

export const PhoneInput = forwardRef(
  ({ className, onCountryChange, onChange, value, placeholder, defaultCountry, inline = false, ...props }, ref) => {
    const [countryData, setCountryData] = useState();
    const [displayFlag, setDisplayFlag] = useState("");
    const [hasInitialized, setHasInitialized] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
      if (defaultCountry) {
        const newCountryData = countries.findByAlpha2(defaultCountry.toUpperCase());
        setCountryData(newCountryData);
        setDisplayFlag(defaultCountry.toLowerCase());

        if (!hasInitialized && newCountryData?.countryCallingCodes?.[0] && !value) {
          onChange?.(newCountryData.countryCallingCodes[0]);
          setHasInitialized(true);
        }
      }
    }, [defaultCountry, onChange, value, hasInitialized]);

    const handlePhoneChange = (e) => {
      let newValue = e.target.value;

      if (!newValue.startsWith("+")) {
        if (newValue.startsWith("00")) {
          newValue = "+" + newValue.slice(2);
        } else {
          newValue = "+" + newValue;
        }
      }

      try {
        const parsed = parsePhoneNumber(newValue);

        if (parsed && parsed.country) {
          const countryCode = parsed.country;
          setDisplayFlag(countryCode.toLowerCase());

          const countryInfo = countries.findByAlpha2(countryCode.toUpperCase());
          setCountryData(countryInfo);
          onCountryChange?.(countryInfo);

          onChange?.(parsed.number);
        } else {
          onChange?.(newValue);
          setDisplayFlag("");
          setCountryData(undefined);
          onCountryChange?.(undefined);
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
        onChange?.(newValue);
        setDisplayFlag("");
        setCountryData(undefined);
        onCountryChange?.(undefined);
      }
    };

    const handleCountrySelect = (country) => {
      setCountryData(country);
      setDisplayFlag(country.alpha2.toLowerCase());
      onCountryChange?.(country);

      // Insert country code into input value
      const callingCode = country.countryCallingCodes[0];

      // If we already have a value, try to preserve the national number
      if (value) {
        try {
          const parsed = parsePhoneNumber(value);
          if (parsed && parsed.nationalNumber) {
            onChange?.(callingCode + parsed.nationalNumber);
          } else {
            onChange?.(callingCode);
          }
        } catch {
          onChange?.(callingCode);
        }
      } else {
        onChange?.(callingCode);
      }

      setOpen(false);
      // Focus the input after selection
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    const inputClasses = cn(
      "flex items-center gap-2 relative bg-background transition-colors text-base rounded-md border border-input pl-3 h-9 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed md:text-sm has-[input:focus]:outline-none has-[input:focus]:ring-1 has-[input:focus]:ring-ring",
      inline && "rounded-l-none w-full",
      className
    );

    return (
      <div className={inputClasses}>
        {!inline && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-6 p-0 rounded-full hover:bg-transparent focus:ring-0"
                type="button"
              >
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full shrink-0 overflow-hidden">
                    {displayFlag ? (
                      <CircleFlag countryCode={displayFlag} width="16" height="16" />
                    ) : (
                      <GlobeIcon size={16} />
                    )}
                  </div>
                  <ChevronDown size={12} />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[240px] max-h-[300px] overflow-y-scroll" align="start" side="bottom">
              <Command>
                <CommandInput placeholder="Search country..." className="h-9" />
                <CommandList className="max-h-[200px]">
                  {allCountries.map((country) => (
                    <CommandItem
                      key={country.alpha2}
                      value={`${country.name} ${country.countryCallingCodes[0]}`}
                      onSelect={() => handleCountrySelect(country)}
                      className="flex items-center gap-2 cursor-pointer py-2"
                    >
                      <div className="w-4 h-4 overflow-hidden flex-shrink-0">
                        <CircleFlag countryCode={country.alpha2.toLowerCase()} width="16" height="16" />
                      </div>
                      <span className="text-sm truncate">{country.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{country.countryCallingCodes[0]}</span>
                      {country.alpha2.toLowerCase() === displayFlag && <span className="ml-1">✓</span>}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        <input
          ref={(element) => {
            // Handle both the forwardRef and our internal ref
            if (typeof ref === "function") {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
            inputRef.current = element;
          }}
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || "Enter number"}
          type="tel"
          autoComplete="tel"
          name="phone"
          className={cn(
            "flex w-full focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-transparent text-sm transition-colors placeholder:text-muted-foreground outline-none h-9 py-1 p-0 leading-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
