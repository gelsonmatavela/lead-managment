"use client";

import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon, ChevronDown, Loader2, X } from "lucide-react";
import debounce from "lodash/debounce";

export type Option = {
  value: string | number;
  label: string;
};

export type AsyncMultipleSelectProps = {
  selectClassName?: string;
  className?: string;
  name: string;
  placeholder?: string;
  label?: string;
  selectContainerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  onSearch: (query: string) => Promise<Option[]>;
  minSearchLength?: number;
  debounceMs?: number;
  defaultValue?: Option[];
  disabled?: boolean;
  onChange?: (value: Option[]) => void;
  defaultOptions?: Option[];
  errors?: Record<string, any>;
};

export default function AsyncMultipleSelect({
  selectClassName,
  className,
  name,
  placeholder = "Procurar...",
  label,
  selectContainerClassName,
  labelClassName,
  required = true,
  showRequiredSign = false,
  onSearch,
  minSearchLength = 1,
  debounceMs = 300,
  defaultValue = [],
  defaultOptions = [],
  disabled = false,
  onChange,
  errors,
}: AsyncMultipleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>(defaultOptions);
  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      debouncedSearch.cancel();
    };
  }, []);

  const handleSelect = (option: Option) => {
    const newValue = selectedOptions.some((opt) => option.value === opt.value)
      ? selectedOptions.filter((opt) => opt.value !== option.value)
      : [...selectedOptions, option];
    setSelectedOptions(newValue);
    onChange?.(newValue);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (valueToRemove: string | number) => {
    const newValue = selectedOptions.filter(
      (opt) => opt.value !== valueToRemove
    );
    setSelectedOptions(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={twMerge("gap-1 inline-grid w-full", className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label className={twMerge("font-bold text-zinc-900", labelClassName)}>
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
          // className={twMerge(
          //   "flex min-w-fit rounded-md border border-zinc-300 bg-background p-2  flex-wrap gap-2",
          //   "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          //   "bg-white placeholder:text-zinc-300 placeholder:font-normal",
          //   selectClassName
          // )}\
          data-disabled={disabled}
          data-focus={isOpen}
          className={twMerge(
            "relative flex min-w-fit rounded-md border border-zinc-300 bg-background p-2  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row flex-wrap gap-2 data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline items-center data-[disabled=true]:bg-zinc-100",
            selectClassName
          )}
        >
          {selectedOptions?.map?.((opt) => (
            <div
              key={opt.value}
              className={`flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md ${
                disabled && "cursor-text"
              }`}
            >
              {opt.label}
              <X
                size={14}
                className={twMerge(
                  `cursor-pointer hover:text-blue-600`,
                  disabled && "hidden"
                )}
                onClick={() => handleRemoveTag(opt.value)}
              />
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 focus:outline-none bg-transparent "
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              debouncedSearch(e.target.value);
            }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            placeholder={selectedOptions.length ? "" : placeholder}
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            !disabled && <ChevronDown size={16} />
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {options.length > 0
              ? options.map((option) => (
                  <div
                    key={option.value}
                    className="p-2 cursor-pointer hover:bg-zinc-50"
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))
              : searchTerm.length >= minSearchLength &&
                !isLoading && (
                  <div className="p-2 text-zinc-500">Nenhum resultado.</div>
                )}
          </div>
        )}
      </div>

      {errors && <div className="text-red-500 text-xs">{errors.message}</div>}
    </div>
  );
}
