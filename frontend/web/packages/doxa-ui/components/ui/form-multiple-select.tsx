"use client";

import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon, ChevronDown, X } from "lucide-react";
import { Controller } from "react-hook-form";
import {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

/**
 * Resolves a deeply nested value from an object using a string path.
 * Supports dot notation and array indices (e.g., "profile.nickname" or "reactions.0.type.name").
 *
 * @param obj - The object to access.
 * @param path - The string path, using dot notation.
 * @returns The resolved value or undefined.
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

/**
 * Sets a value at a deeply nested path in an object.
 * Creates intermediate objects and arrays as needed.
 *
 * @param obj - The object to modify
 * @param path - The dot notation path where to set the value
 * @param value - The value to set
 * @returns The modified object
 */
function setValueByPath(obj: any, path: string, value: any): any {
  if (!path) return { ...obj };

  const result = { ...obj };
  const parts = path.split(".");
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextPartArrayIndex = /^\d+$/.test(nextPart);

    if (!(part in current)) {
      current[part] = isNextPartArrayIndex ? [] : {};
    }

    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return result;
}

/**
 * Represents an option object used in the select component.
 */
export type Option = {
  value: string | number;
  label: string | React.ReactNode;
};

/**
 * Props for the FormMultipleSelect component.
 */
export type FormMultipleSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  /** Custom class name for the outer container */
  className?: string;

  /** Custom class name for the label element */
  labelClassName?: string;

  /** Custom class name for the select input area */
  selectClassName?: string;

  /** Custom class name for the select wrapper */
  selectContainerClassName?: string;

  /** Field name (used by react-hook-form) */
  name: TFieldName;

  /** Input placeholder */
  placeholder?: string;

  /** Label text to show above the select */
  label?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Whether to show a red asterisk if required */
  showRequiredSign?: boolean;

  /** List of available options */
  options: Option[];

  /** Initial value for the select input */
  defaultValue?: Option[] | any[];

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Callback when the selected values change */
  onChange?: (value: Option[] | any[]) => void;

  /** Callback when an option is removed */
  onRemove?: (value: FieldPathValue<TFieldValues, TFieldName>[number]) => void;

  /** Callback when an option is selected */
  onSelect?: (value: FieldPathValue<TFieldValues, TFieldName>[number]) => void;

  /** Custom default selected options (optional) */
  defaultSelectedOptions?: Option[];

  /** react-hook-form errors object */
  errors?: Record<string, any>;

  /** react-hook-form methods */
  form: UseFormReturn<TFieldValues>;

  /** Whether to allow searching/filtering options */
  filterable?: boolean;

  /** Return full objects or just values */
  returnObjects?: boolean;

  /**
   * Optional mapping of option value/label field names (used to transform raw data).
   * Supports deep paths like "profile.nickname" or array access like "reactions.0.type.name"
   */
  optionDataFields?: { label: string; value: string };
};

/**
 * Multiple-select component integrated with react-hook-form.
 * Supports deep nested data structures for mapping labels and values.
 */
export default function FormMultipleSelect<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  className,
  labelClassName,
  selectClassName,
  selectContainerClassName,
  name,
  placeholder = "Selecionar...",
  label,
  required = true,
  showRequiredSign = false,
  options = [],
  defaultValue = [],
  disabled = false,
  onRemove,
  onSelect,
  errors,
  form,
  optionDataFields,
  filterable = true,
  returnObjects = true,
  ...props
}: FormMultipleSelectProps<TFieldValues, TFieldName>) {
  type FieldValue = FieldPathValue<TFieldValues, TFieldName>;

  /**
   * Transforms raw data to Option[] format using optionDataFields.
   * Supports deep nesting via dot notation (e.g., "profile.nickname").
   */
  function transformValuesToValidOptions(
    values: any[] | any
  ): Option | Option[] {
    if (!optionDataFields || !values) return values;

    if (Array.isArray(values)) {
      return values.map((value: any) => ({
        label: getValueByPath(value, optionDataFields.label) || "",
        value: getValueByPath(value, optionDataFields.value) || "",
      }));
    }

    return {
      label: getValueByPath(values, optionDataFields.label) || "",
      value: getValueByPath(values, optionDataFields.value) || "",
    };
  }

  /**
   * Reverts Option[] back to original format using optionDataFields.
   * Reconstructs the original object structure based on the paths.
   */
  function reverseTransformOptionsToValidValues(
    options: Option[] | Option
  ): FieldValue | FieldValue[] {
    if (!returnObjects) {
      return Array.isArray(options) 
        ? options.map(opt => opt.value) as unknown as FieldValue[]
        : (options as Option).value as unknown as FieldValue;
    }
    
    if (!optionDataFields) return options as FieldValue[];

    if (Array.isArray(options)) {
      return options.map((option: any) => {
        let result = {} as FieldValue;
        result = setValueByPath(
          result,
          optionDataFields.label,
          option.label || ""
        );
        result = setValueByPath(
          result,
          optionDataFields.value,
          option.value || ""
        );
        return result;
      });
    }

    let result = {} as FieldValue;
    result = setValueByPath(
      result,
      optionDataFields.label,
      (options as Option).label || ""
    );
    result = setValueByPath(
      result,
      optionDataFields.value,
      (options as Option).value || ""
    );
    return result as FieldValue;
  }

  /**
   * Converts primitive values to Option objects by matching them with available options
   */
  function convertValuesToOptions(values: any[]): Option[] {
    if (!values || !Array.isArray(values)) return [];
    
    // Check if values are already Option objects
    if (values.length > 0 && typeof values[0] === 'object' && 'value' in values[0] && 'label' in values[0]) {
      return values as Option[];
    }
    
    // Convert primitive values to Option objects
    return values.map(value => {
      const matchedOption = options.find(opt => opt.value === value);
      return matchedOption || { value, label: String(value) };
    });
  }

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  
  // Initialize selectedOptions based on form's default values
  const initialSelectedOptions = () => {
    const formDefaultValues = form.formState.defaultValues?.[name];
    if (!formDefaultValues) return [];
    
    if (returnObjects) {
      // If returnObjects is true, we expect the default values to be objects
      return transformValuesToValidOptions(formDefaultValues) as Option[];
    } else {
      // If returnObjects is false, we expect the default values to be primitive values
      return convertValuesToOptions(formDefaultValues as any[]);
    }
  };
  
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(initialSelectedOptions());
  
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize filtered options on component mount and when options change
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Filter options when searchTerm changes
  useEffect(() => {
    if (filterable && searchTerm) {
      const filtered = options.filter(option => 
        String(option.label).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, filterable]);

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
    };
  }, []);

  const handleSelect = (
    option: Option,
    currentOptions: Option[],
    onChange: (value: any) => void
  ) => {
    const isSelected = currentOptions.some(opt => opt.value === option.value);
    const newValue = isSelected
      ? currentOptions.filter(opt => opt.value !== option.value)
      : [...currentOptions, option];
    
    setSelectedOptions(newValue);
    onChange?.(reverseTransformOptionsToValidValues(newValue));
    
    if (!isSelected) {
      onSelect?.(reverseTransformOptionsToValidValues(option) as FieldValue);
    }
    
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleRemoveTag = (
    optionToRemove: Option,
    currentOptions: Option[],
    onChange: (value: any) => void
  ) => {
    const newValue = currentOptions.filter(
      opt => opt.value !== optionToRemove.value
    );
    setSelectedOptions(newValue);
    onRemove?.(
      reverseTransformOptionsToValidValues(optionToRemove) as FieldValue
    );
    onChange?.(reverseTransformOptionsToValidValues(newValue));
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

      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value } }) => {
          // Convert value to Option objects if value is not empty
          const currentSelectedOptions = value 
            ? (returnObjects 
                ? transformValuesToValidOptions(value) as Option[]
                : convertValuesToOptions(value as any[]))
            : selectedOptions;
          
          // Update local state if value has changed
          if (JSON.stringify(currentSelectedOptions) !== JSON.stringify(selectedOptions)) {
            setSelectedOptions(currentSelectedOptions as Option[]);
          }
          
          return (
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
                onClick={() => {
                  if (!isOpen) {
                    setIsOpen(true);
                    inputRef.current?.focus();
                  }
                }}
              >
                {currentSelectedOptions?.map?.((opt: Option) => (
                  <div
                    key={`${opt.value}`}
                    className={`flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md ${
                      disabled ? "cursor-text" : ""
                    }`}
                  >
                    {opt.label}
                    <X
                      size={14}
                      className={twMerge(
                        "cursor-pointer hover:text-blue-600",
                        disabled && "hidden"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(opt, currentSelectedOptions as Option[], onChange);
                      }}
                    />
                  </div>
                ))}
                {filterable && (
                  <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 focus:outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    placeholder={currentSelectedOptions?.length ? "" : placeholder}
                  />
                )}
                {!filterable && (!currentSelectedOptions || currentSelectedOptions.length === 0) && (
                  <span className="text-zinc-400 flex-1">{placeholder}</span>
                )}
                {!disabled && <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`} />}
              </div>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const isSelected = currentSelectedOptions?.some(opt => opt.value === option.value);
                      return (
                        <div
                          key={`option-${option.value}`}
                          className={twMerge(
                            "p-2 cursor-pointer hover:bg-zinc-50",
                            isSelected && "bg-zinc-100"
                          )}
                          onClick={() => handleSelect(option, currentSelectedOptions as Option[], onChange)}
                        >
                          {option.label}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-zinc-500">Nenhum resultado.</div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />

      {form.formState.errors[name] && (
        <div className="text-red-500 text-xs">
          {form.formState.errors[name]?.message?.toString()}
        </div>
      )}
    </div>
  );
}