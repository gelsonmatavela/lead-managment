"use client";

import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon, ChevronDown, Loader2 } from "lucide-react";
import React from "react";
import debounce from "lodash/debounce";

/**
 * Resolves a deeply nested value from an object using a string path.
 * Supports dot notation and array indices.
 */
function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;

  const parts = path.split(".");
  let result = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Check if we're accessing an array index
    if (/^\d+$/.test(part) && Array.isArray(result)) {
      const index = parseInt(part, 10);
      result = result[index];
    } else {
      result = result?.[part];
    }

    // Return undefined if we hit a null/undefined value before reaching the end
    if (result === undefined || result === null) {
      return undefined;
    }
  }

  return result;
}

export type AsyncSelectProps<T> = {
  /** Custom class name for the outer container */
  className?: string;

  /** Custom class name for the label element */
  labelClassName?: string;

  /** Custom class name for the select input area */
  selectClassName?: string;

  /** Custom class name for the select wrapper */
  selectContainerClassName?: string;

  /** Field name */
  name?: string;

  /** Input placeholder */
  placeholder?: string;

  /** Label text to show above the select */
  label?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Whether to show a red asterisk if required */
  showRequiredSign?: boolean;

  /** Function to fetch search results (should return a Promise with array of data) */
  onSearch: (query: string) => Promise<T[]>;

  /** Minimum characters before search is triggered */
  minSearchLength?: number;

  /** Debounce time for search input (in ms) */
  debounceMs?: number;

  /** Initial value for the select input */
  defaultValue?: any;

  /** Current value */
  value?: any;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Callback when the selected value changes */
  onChange?: (value: T) => void;

  /** Error message to display */
  error?: string;

  /**
   * Optional mapping of option value/label field names.
   * Supports deep paths like "profile.nickname" or array access like "reactions.0.type.name"
   */
  optionDataFields?: { label: string; value: string };

  /** Callback when an option is selected */
  onSelect?: (value: T) => void;
};

/**
 * Enhanced AsyncSelect component that doesn't require form integration,
 * but has the same behavior and appearance as FormAsyncSelect.
 */
export default function AsyncSelect<T>({
  className,
  labelClassName,
  selectClassName,
  selectContainerClassName,
  name,
  placeholder = "Procurar...",
  label,
  required = false,
  showRequiredSign = false,
  onSearch,
  minSearchLength = 1,
  debounceMs = 300,
  defaultValue,
  value,
  disabled = false,
  onChange,
  error,
  optionDataFields,
  onSelect,
}: AsyncSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get display label for any option
  const getOptionLabel = (option: any): string => {
    if (!option) return "";
    if (optionDataFields) {
      return getValueByPath(option, optionDataFields.label) || "";
    }
    return option.label || "";
  };

  // Get value for any option
  const getOptionValue = (option: any): string | number => {
    if (!option) return "";
    if (optionDataFields) {
      return getValueByPath(option, optionDataFields.value) || "";
    }
    return option.value || "";
  };

  // Check if two options are the same
  const isOptionEqual = (option1: any, option2: any): boolean => {
    if (!option1 || !option2) return false;
    return getOptionValue(option1) === getOptionValue(option2);
  };

  // Debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= minSearchLength) {
      setIsLoading(true);
      try {
        const results = await onSearch(query);
        setOptions(results);
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setOptions([]);
    }
  }, debounceMs);

  // Initialize with default or provided value
  useEffect(() => {
    const initialValue = value || defaultValue;
    if (initialValue) {
      setSelectedOption(initialValue);
      setSearchTerm(getOptionLabel(initialValue));
    }
  }, []);

  // Update when value changes externally
  useEffect(() => {
    if (value && (!selectedOption || !isOptionEqual(value, selectedOption))) {
      setSelectedOption(value);
      setSearchTerm(getOptionLabel(value));
    } else if (!value && selectedOption) {
      setSelectedOption(null);
      setSearchTerm("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // If user clicks outside without selecting and there's a selectedOption,
        // reset search term to selected option's label
        if (selectedOption) {
          setSearchTerm(getOptionLabel(selectedOption));
        } else {
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [selectedOption]);

  // Handle selection of an option
  const handleSelect = (option: any) => {
    setSelectedOption(option);
    onChange?.(option);
    onSelect?.(option);
    setSearchTerm(getOptionLabel(option));
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);

    // if (!newTerm) {
    //   setSelectedOption(null);
    //   onChange?.(null);
    // }

    setIsOpen(true);
    debouncedSearch(newTerm);
  };

  return (
    <div className={twMerge("gap-1 inline-grid w-full", className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label
            htmlFor={`async-select-${name}`}
            className={twMerge("font-bold text-zinc-900", labelClassName)}
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon size={12} color="red" />
          )}
        </div>
      )}

      <div
        ref={selectRef}
        className={twMerge("relative", selectContainerClassName)}
      >
        <div
          data-disabled={disabled}
          data-focus={isOpen}
          className={twMerge(
            "relative flex min-w-fit rounded-md border border-zinc-300 bg-background p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row flex-wrap gap-2 data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline items-center data-[disabled=true]:bg-zinc-100",
            selectClassName
          )}
        >
          <input
            id={`async-select-${name}`}
            ref={inputRef}
            type="text"
            className="flex-1 focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              inputRef.current?.select();
            }}
            disabled={disabled}
            placeholder={placeholder}
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
              size={16}
            />
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={`${getOptionValue(option)}-${index}`}
                  className={twMerge(
                    "p-2 cursor-pointer hover:bg-zinc-50",
                    selectedOption &&
                      isOptionEqual(selectedOption, option) &&
                      "bg-zinc-100"
                  )}
                  onClick={() => handleSelect(option)}
                >
                  {getOptionLabel(option)}
                </div>
              ))
            ) : searchTerm.length >= minSearchLength && !isLoading ? (
              <div className="p-2 text-zinc-500">Nenhum resultado.</div>
            ) : null}
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
