'use client';

import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { AsteriskIcon, ChevronDown, Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';
import { Controller, UseFormReturn } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

/**
 * Resolves a deeply nested value from an object using a string path.
 * Supports dot notation and array indices.
 */
function getValueByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;

  const parts = path.split('.');
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
 * Represents an option in the select dropdown.
 */
export type Option = {
  value: string | number;
  label: string;
};

/**
 * Props for the `FormAsyncSelect` component.
 */
export type FormAsyncSelectProps<
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

  /** Function to fetch search results (should return a Promise with array of data) */
  onSearch: (query: string) => Promise<any[]>;

  /** Minimum characters before search is triggered */
  minSearchLength?: number;

  /** Debounce time for search input (in ms) */
  debounceMs?: number;

  /** Initial value for the select input */
  defaultValue?: any;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Callback when the selected value changes */
  onSelect?: (value: any) => void;

  /** react-hook-form errors object */
  errors?: Record<string, any>;

  /** react-hook-form methods */
  form: UseFormReturn<TFieldValues>;

  /**
   * Optional mapping of option value/label field names.
   * Supports deep paths like "profile.nickname" or array access like "reactions.0.type.name"
   */
  optionDataFields?: { label: string; value: string };
};

/**
 * Asynchronous single-select component integrated with react-hook-form.
 * Features similar UI to the multiple select component but for single selection.
 */
export default function FormAsyncSelect<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  className,
  labelClassName,
  selectClassName,
  selectContainerClassName,
  name,
  placeholder = 'Procurar...',
  label,
  required = true,
  showRequiredSign = false,
  onSearch,
  minSearchLength = 1,
  debounceMs = 300,
  defaultValue,
  disabled = false,
  onSelect,
  errors,
  form,
  optionDataFields,
}: FormAsyncSelectProps<TFieldValues, TFieldName>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get display label for any option
  const getOptionLabel = (option: any): string => {
    if (!option) return '';
    if (optionDataFields) {
      return getValueByPath(option, optionDataFields.label) || '';
    }
    return option.label || '';
  };

  // Get value for any option
  const getOptionValue = (option: any): string | number => {
    if (!option) return '';
    if (optionDataFields) {
      return getValueByPath(option, optionDataFields.value) || '';
    }
    return option.value || '';
  };

  // Check if two options are the same
  const isOptionEqual = (option1: any, option2: any): boolean => {
    if (!option1 || !option2) return false;
    return getOptionValue(option1) === getOptionValue(option2);
  };

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= minSearchLength) {
      setIsLoading(true);
      try {
        // onSearch directly returns the data array as per your requirement
        const results = await onSearch(query);
        setOptions(results);
      } catch (error) {
        console.error('Search error:', error);
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
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If user clicks outside without selecting and there's a selectedOption,
        // reset search term to selected option's label
        if (selectedOption) {
          setSearchTerm(getOptionLabel(selectedOption));
        } else {
          setSearchTerm('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedSearch.cancel();
    };
  }, [selectedOption]);

  // Handle selection of an option
  const handleSelect = (option: any, onChange: (value: any) => void) => {
    setSelectedOption(option);
    onChange?.(option);
    onSelect?.(option);
    setSearchTerm(getOptionLabel(option));
    setIsOpen(false);
  };

  // Handle clearing the input
  const handleClear = (onChange: (value: any) => void) => {
    setSelectedOption(null);
    setSearchTerm('');
    onChange?.(null);
    onSelect?.(null);
    inputRef.current?.focus();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: any) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);

    if (!newTerm) {
      setSelectedOption(null);
      onChange?.(null);
    }

    setIsOpen(true);
    debouncedSearch(newTerm);
  };

  return (
    <div className={twMerge('gap-1 inline-grid w-full', className)}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label className={twMerge('font-bold text-zinc-900', labelClassName)}>{label}</label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
        </div>
      )}

      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value = defaultValue } }) => {
          // Initialize selected option and search term from form value
          useEffect(() => {
            if (value) {
              setSelectedOption(value);
              setSearchTerm(getOptionLabel(value));
            }
          }, []);

          return (
            <div ref={selectRef} className={twMerge('relative', selectContainerClassName)}>
              <div
                data-disabled={disabled}
                data-focus={isOpen}
                className={twMerge(
                  'relative flex min-w-fit rounded-md border border-zinc-300 bg-background p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row flex-wrap gap-2 data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline items-center data-[disabled=true]:bg-zinc-100',
                  selectClassName
                )}
              >
                <input
                  ref={inputRef}
                  type='text'
                  className='flex-1 focus:outline-none bg-transparent'
                  value={searchTerm}
                  onChange={(e) => handleInputChange(e, onChange)}
                  onFocus={() => {
                    setIsOpen(true);
                    inputRef.current?.select();
                  }}
                  disabled={disabled}
                  placeholder={placeholder}
                />
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <ChevronDown
                    className={`transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                    size={16}
                  />
                )}
              </div>

              {isOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                  {options.length > 0 ? (
                    options.map((option, index) => (
                      <div
                        key={`${getOptionValue(option)}-${index}`}
                        className={twMerge(
                          'p-2 cursor-pointer hover:bg-zinc-50',
                          selectedOption && isOptionEqual(selectedOption, option) && 'bg-zinc-100'
                        )}
                        onClick={() => handleSelect(option, onChange)}
                      >
                        {getOptionLabel(option)}
                      </div>
                    ))
                  ) : searchTerm.length >= minSearchLength && !isLoading ? (
                    <div className='p-2 text-zinc-500'>Nenhum resultado.</div>
                  ) : null}
                </div>
              )}
            </div>
          );
        }}
      />

      {getNestedErrorMessage(form.formState.errors, name) && (
        <div className='text-red-500 text-xs'>
          *{getNestedErrorMessage(form.formState.errors, name) as string}
        </div>
      )}
    </div>
  );
}
