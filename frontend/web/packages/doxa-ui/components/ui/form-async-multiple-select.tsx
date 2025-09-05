// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { twMerge } from "tailwind-merge";
// import { AsteriskIcon, ChevronDown, Loader2, X } from "lucide-react";
// import debounce from "lodash/debounce";
// import { Controller } from "react-hook-form";
// import {
//   FieldPath,
//   FieldPathValue,
//   FieldValues,
//   UseFormReturn,
// } from "react-hook-form";

// /**
//  * Resolves a deeply nested value from an object using a string path.
//  * Supports dot notation and array indices (e.g., "profile.nickname" or "reactions.0.type.name").
//  *
//  * @param obj - The object to access.
//  * @param path - The string path, using dot notation.
//  * @returns The resolved value or undefined.
//  */
// function getValueByPath(obj: any, path: string): any {
//   if (!obj || !path) return undefined;

//   const parts = path.split(".");
//   let result = obj;

//   for (let i = 0; i < parts.length; i++) {
//     const part = parts[i];

//     // Check if we're accessing an array index
//     if (/^\d+$/.test(part) && Array.isArray(result)) {
//       const index = parseInt(part, 10);
//       result = result[index];
//     } else {
//       result = result?.[part];
//     }

//     // Return undefined if we hit a null/undefined value before reaching the end
//     if (result === undefined || result === null) {
//       return undefined;
//     }
//   }

//   return result;
// }

// /**
//  * Sets a value at a deeply nested path in an object.
//  * Creates intermediate objects and arrays as needed.
//  *
//  * @param obj - The object to modify
//  * @param path - The dot notation path where to set the value
//  * @param value - The value to set
//  * @returns The modified object
//  */
// function setValueByPath(obj: any, path: string, value: any): any {
//   if (!path) return { ...obj };

//   const result = { ...obj };
//   const parts = path.split(".");
//   let current = result;

//   for (let i = 0; i < parts.length - 1; i++) {
//     const part = parts[i];
//     const nextPart = parts[i + 1];
//     const isNextPartArrayIndex = /^\d+$/.test(nextPart);

//     if (!(part in current)) {
//       current[part] = isNextPartArrayIndex ? [] : {};
//     }

//     current = current[part];
//   }

//   current[parts[parts.length - 1]] = value;
//   return result;
// }

// /**
//  * Represents an option object used in the select component.
//  */
// export type Option = {
//   value: string | number;
//   label: string;
// };

// /**
//  * Props for the FormAsyncMultipleSelect component.
//  */
// export type FormAsyncMultipleSelectProps<
//   TFieldValues extends FieldValues = FieldValues,
//   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// > = {
//   /** Custom class name for the outer container */
//   className?: string;

//   /** Custom class name for the label element */
//   labelClassName?: string;

//   /** Custom class name for the select input area */
//   selectClassName?: string;

//   /** Custom class name for the select wrapper */
//   selectContainerClassName?: string;

//   /** Field name (used by react-hook-form) */
//   name: TFieldName;

//   /** Input placeholder */
//   placeholder?: string;

//   /** Label text to show above the select */
//   label?: string;

//   /** Whether the field is required */
//   required?: boolean;

//   /** Whether to show a red asterisk if required */
//   showRequiredSign?: boolean;

//   /** Function to fetch search results (should return a Promise with Option[]) */
//   onSearch: (query: string) => Promise<any[]>;

//   /** Minimum characters before search is triggered */
//   minSearchLength?: number;

//   /** Debounce time for search input (in ms) */
//   debounceMs?: number;

//   /** Initial value for the select input */
//   defaultValue?: Option[];

//   /** Whether the input is disabled */
//   disabled?: boolean;

//   /** Callback when the selected values change */
//   onChange?: (value: Option[]) => void;

//   /** Callback when an option is removed */
//   onRemove?: (value: FieldPathValue<TFieldValues, TFieldName>[number]) => void;

//   /** Callback when an option is selected */
//   onSelect?: (value: FieldPathValue<TFieldValues, TFieldName>[number]) => void;

//   /** Custom default selected options (optional) */
//   defaultSelectedOptions?: Option[];

//   /** react-hook-form errors object */
//   errors?: Record<string, any>;

//   /** react-hook-form methods */
//   form: UseFormReturn<TFieldValues>;

//   /**
//    * Optional mapping of option value/label field names (used to transform raw data).
//    * Supports deep paths like "profile.nickname" or array access like "reactions.0.type.name"
//    */
//   optionDataFields?: { label: string; value: string };
// };

// /**
//  * Asynchronous multi-select component integrated with react-hook-form.
//  * Supports deep nested data structures for mapping labels and values.
//  */
// export default function FormAsyncMultipleSelect<
//   TFieldValues extends FieldValues = FieldValues,
//   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >({
//   className,
//   labelClassName,
//   selectClassName,
//   selectContainerClassName,
//   name,
//   placeholder = "Procurar...",
//   label,
//   required = true,
//   showRequiredSign = false,
//   onSearch,
//   minSearchLength = 1,
//   debounceMs = 300,
//   defaultValue = [],
//   disabled = false,
//   onRemove,
//   onSelect,
//   errors,
//   form,
//   optionDataFields,
// }: FormAsyncMultipleSelectProps<TFieldValues, TFieldName>) {
//   type FieldValue = FieldPathValue<TFieldValues, TFieldName>;

//   /**
//    * Transforms raw data to Option[] format using optionDataFields.
//    * Supports deep nesting via dot notation (e.g., "profile.nickname").
//    */
//   function transformValuesToValidOptions(
//     values: any[] | any
//   ): Option | Option[] {
//     if (!optionDataFields || !values) return values;

//     if (Array.isArray(values)) {
//       return values.map((value: any) => ({
//         label: getValueByPath(value, optionDataFields.label) || "",
//         value: getValueByPath(value, optionDataFields.value) || "",
//       }));
//     }

//     return {
//       label: getValueByPath(values, optionDataFields.label) || "",
//       value: getValueByPath(values, optionDataFields.value) || "",
//     };
//   }

//   /**
//    * Reverts Option[] back to original format using optionDataFields.
//    * Reconstructs the original object structure based on the paths.
//    */
//   function reverseTransformOptionsToValidValues(
//     options: Option[] | Option
//   ): FieldValue | FieldValue[] {
//     if (!optionDataFields) return options as FieldValue[];

//     if (Array.isArray(options)) {
//       return options.map((option: any) => {
//         let result = {} as FieldValue;
//         result = setValueByPath(
//           result,
//           optionDataFields.label,
//           option.label || ""
//         );
//         result = setValueByPath(
//           result,
//           optionDataFields.value,
//           option.value || ""
//         );
//         return result;
//       });
//     }

//     let result = {} as FieldValue;
//     result = setValueByPath(
//       result,
//       optionDataFields.label,
//       (options as Option).label || ""
//     );
//     result = setValueByPath(
//       result,
//       optionDataFields.value,
//       (options as Option).value || ""
//     );
//     return result as FieldValue;
//   }

//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [options, setOptions] = useState<Option[]>([]);
//   const [selectedOptions, setSelectedOptions] = useState<Option[]>(
//     transformValuesToValidOptions(
//       form.formState.defaultValues?.[name] || []
//     ) as Option[]
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const selectRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const debouncedSearch = debounce(async (query: string) => {
//     if (query.length >= minSearchLength) {
//       setIsLoading(true);
//       try {
//         const results = await onSearch(query);
//         // Transform API results to Option[] format
//         const transformedResults = optionDataFields
//           ? results.map((item) => ({
//               label: getValueByPath(item, optionDataFields.label) || "",
//               value: getValueByPath(item, optionDataFields.value) || "",
//             }))
//           : results;
//         setOptions(transformedResults);
//       } catch (error) {
//         console.error("Search error:", error);
//         setOptions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setOptions([]);
//     }
//   }, debounceMs);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         selectRef.current &&
//         !selectRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       debouncedSearch.cancel();
//     };
//   }, []);

//   const handleSelect = (
//     option: Option,
//     currentOptions: Option[],
//     onChange: (value: any) => void
//   ) => {
//     const newValue = currentOptions.some((opt) => opt.value === option.value)
//       ? currentOptions.filter((opt) => opt.value !== option.value)
//       : [...currentOptions, option];
//     setSelectedOptions(newValue);
//     onChange?.(reverseTransformOptionsToValidValues(newValue));
//     onSelect?.(reverseTransformOptionsToValidValues(option) as FieldValue);
//     setSearchTerm("");
//     inputRef.current?.focus();
//   };

//   const handleRemoveTag = (
//     optionToRemove: Option,
//     currentOptions: Option[],
//     onChange: (value: any) => void
//   ) => {
//     const newValue = currentOptions.filter(
//       (opt) => opt.value !== optionToRemove.value
//     );
//     setSelectedOptions(newValue);
//     onRemove?.(
//       reverseTransformOptionsToValidValues(optionToRemove) as FieldValue
//     );
//     onChange?.(reverseTransformOptionsToValidValues(newValue));
//   };

//   return (
//     <div className={twMerge("gap-1 inline-grid w-full", className)}>
//       {label && (
//         <div className="flex flex-row items-center gap-1">
//           <label className={twMerge("font-bold text-zinc-900", labelClassName)}>
//             {label}
//           </label>
//           {required && showRequiredSign && (
//             <AsteriskIcon size={12} color="red" />
//           )}
//         </div>
//       )}

//       <Controller
//         control={form.control}
//         name={name}
//         render={({ field: { onChange, value = defaultValue } }) => (
//           <div
//             ref={selectRef}
//             className={twMerge("relative", selectContainerClassName)}
//           >
//             <div
//               data-disabled={disabled}
//               data-focus={isOpen}
//               className={twMerge(
//                 "relative flex min-w-fit rounded-md border border-zinc-300 bg-background p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row flex-wrap gap-2 data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline items-center data-[disabled=true]:bg-zinc-100",
//                 selectClassName
//               )}
//             >
//               {selectedOptions?.map?.((opt) => (
//                 <div
//                   key={opt.value}
//                   className={`flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md ${
//                     disabled ? "cursor-text" : ""
//                   }`}
//                 >
//                   {opt.label}
//                   <X
//                     size={14}
//                     className={twMerge(
//                       "cursor-pointer hover:text-blue-600",
//                       disabled && "hidden"
//                     )}
//                     onClick={() =>
//                       handleRemoveTag(opt, selectedOptions, onChange)
//                     }
//                   />
//                 </div>
//               ))}
//               <input
//                 ref={inputRef}
//                 type="text"
//                 className="flex-1 focus:outline-none bg-transparent"
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setIsOpen(true);
//                   debouncedSearch(e.target.value);
//                 }}
//                 onFocus={() => setIsOpen(true)}
//                 disabled={disabled}
//                 placeholder={selectedOptions.length ? "" : placeholder}
//               />
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 !disabled && <ChevronDown size={16} />
//               )}
//             </div>

//             {isOpen && (
//               <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//                 {options.length > 0 ? (
//                   options.map((option) => (
//                     <div
//                       key={option.value}
//                       className="p-2 cursor-pointer hover:bg-zinc-50"
//                       onClick={() =>
//                         handleSelect(option, selectedOptions, onChange)
//                       }
//                     >
//                       {option.label}
//                     </div>
//                   ))
//                 ) : searchTerm.length >= minSearchLength && !isLoading ? (
//                   <div className="p-2 text-zinc-500">Nenhum resultado.</div>
//                 ) : null}
//               </div>
//             )}
//           </div>
//         )}
//       />

//       {form.formState.errors[name] && (
//         <div className="text-red-500 text-xs">
//           {form.formState.errors[name]?.message?.toString()}
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { AsteriskIcon, ChevronDown, Loader2, X } from 'lucide-react';
import debounce from 'lodash/debounce';
import { Controller } from 'react-hook-form';
import { FieldPath, FieldPathValue, FieldValues, UseFormReturn } from 'react-hook-form';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

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
 * Represents an option object used in the select component.
 */
export type Option = {
  value: string | number;
  label: string;
  originalData: any; // Store the original data structure
};

/**
 * Props for the FormAsyncMultipleSelect component.
 */
export type FormAsyncMultipleSelectProps<
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

  /** Function to fetch search results (should return a Promise with Option[]) */
  onSearch: (query: string) => Promise<any[]>;

  /** Minimum characters before search is triggered */
  minSearchLength?: number;

  /** Debounce time for search input (in ms) */
  debounceMs?: number;

  /** Initial value for the select input */
  defaultValue?: any[];

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Callback when the selected values change */
  onChange?: (value: any[]) => void;

  /** Callback when an option is removed */
  onRemove?: (value: any) => void;

  /** Callback when an option is selected */
  onSelect?: (value: any) => void;

  /** Custom default selected options (optional) */
  defaultSelectedOptions?: Option[];

  /** react-hook-form errors object */
  errors?: Record<string, any>;

  /** react-hook-form methods */
  form: UseFormReturn<TFieldValues>;

  /**
   * Optional mapping of option value/label field names (used to transform raw data).
   * Supports deep paths like "profile.nickname" or array access like "reactions.0.type.name"
   */
  optionDataFields?: { label: string; value: string };
};

/**
 * Asynchronous multi-select component integrated with react-hook-form.
 * Supports deep nested data structures for mapping labels and values.
 * Preserves original data structure when returning values.
 */
export default function FormAsyncMultipleSelect<
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
  defaultValue = [],
  disabled = false,
  onRemove,
  onSelect,
  errors,
  form,
  optionDataFields,
}: FormAsyncMultipleSelectProps<TFieldValues, TFieldName>) {
  /**
   * Transforms raw data to Option[] format while preserving original data.
   */
  function transformToOptions(values: any[]): Option[] {
    if (!values || !Array.isArray(values)) return [];

    return values.map((item) => ({
      label: optionDataFields
        ? getValueByPath(item, optionDataFields.label) || ''
        : item.label || '',
      value: optionDataFields
        ? getValueByPath(item, optionDataFields.value) || ''
        : item.value || '',
      originalData: item, // Store the complete original object
    }));
  }

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    transformToOptions(form.formState.defaultValues?.[name] || [])
  );
  const [isLoading, setIsLoading] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= minSearchLength) {
      setIsLoading(true);
      try {
        const results = await onSearch(query);
        // Transform API results to Option[] format while preserving original data
        const transformedResults = results.map((item) => ({
          label: optionDataFields
            ? getValueByPath(item, optionDataFields.label) || ''
            : item.label || '',
          value: optionDataFields
            ? getValueByPath(item, optionDataFields.value) || ''
            : item.value || '',
          originalData: item,
        }));
        setOptions(transformedResults);
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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      debouncedSearch.cancel();
    };
  }, []);

  const handleSelect = (
    option: Option,
    currentOptions: Option[],
    onChange: (value: any) => void
  ) => {
    // Check if option is already selected by comparing values
    const isSelected = currentOptions.some((opt) => opt.value === option.value);

    const newOptions = isSelected
      ? currentOptions.filter((opt) => opt.value !== option.value)
      : [...currentOptions, option];

    setSelectedOptions(newOptions);

    // Return the array of original data objects
    const originalDataArray = newOptions.map((opt) => opt.originalData);
    onChange(originalDataArray);

    if (!isSelected && onSelect) {
      onSelect(option.originalData);
    }

    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemoveTag = (
    optionToRemove: Option,
    currentOptions: Option[],
    onChange: (value: any) => void
  ) => {
    const newOptions = currentOptions.filter((opt) => opt.value !== optionToRemove.value);

    setSelectedOptions(newOptions);

    if (onRemove) {
      onRemove(optionToRemove.originalData);
    }

    // Return the array of original data objects
    const originalDataArray = newOptions.map((opt) => opt.originalData);
    onChange(originalDataArray);
  };

  const currentValue = form.watch(name);

  useEffect(() => {
    if (!currentValue || currentValue.length === 0) {
      // If value is empty, clear selectedOptions
      setSelectedOptions([]);
    } else if (Array.isArray(currentValue)) {
      // If currentValue has items, transform and set them
      const transformedOptions = transformToOptions(currentValue);
      setSelectedOptions(transformedOptions);
    }
  }, [currentValue]);

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
          // If the value changes externally, update the selectedOptions
          // useEffect(() => {
          //   if (value && Array.isArray(value)) {
          //   }
          // }, [value]);

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
                {selectedOptions?.map?.((opt) => (
                  <div
                    key={opt.value}
                    className={`flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md ${
                      disabled ? 'cursor-text' : ''
                    }`}
                  >
                    {opt.label}
                    <X
                      size={14}
                      className={twMerge(
                        'cursor-pointer hover:text-blue-600',
                        disabled && 'hidden'
                      )}
                      onClick={() => {
                        setSelectedOptions(transformToOptions(value));
                        handleRemoveTag(opt, selectedOptions, onChange);
                      }}
                    />
                  </div>
                ))}
                <input
                  ref={inputRef}
                  type='text'
                  className='flex-1 focus:outline-none bg-transparent'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                    debouncedSearch(e.target.value);
                  }}
                  onFocus={() => setIsOpen(true)}
                  disabled={disabled}
                  placeholder={selectedOptions.length ? '' : placeholder}
                />
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  !disabled && <ChevronDown size={16} />
                )}
              </div>

              {isOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                  {options.length > 0 ? (
                    options.map((option) => (
                      <div
                        key={option.value}
                        className='p-2 cursor-pointer hover:bg-zinc-50'
                        onClick={() => handleSelect(option, selectedOptions, onChange)}
                      >
                        {option.label}
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
