'use client';

import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { AsteriskIcon, EyeIcon, EyeOffIcon, SearchIcon } from 'lucide-react';
import React from 'react';

/**
 * Props for the base `Input` component
 */
type InputProps = {
  /** Additional class name for the input element */
  inputClassName?: string;
  /** Additional class name for the container */
  className?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Label text for the input */
  label?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Additional class name for the input container */
  inputContainerClassName?: string;
  /** Input type (e.g., text, number, password) */
  type?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to trim input value before calling onChange */
  trim?: boolean;
  /** Current value of the input */
  value?: string | number;
  /** Callback fired when input value changes */
  onChange?: (value: string | number | null) => void;
  /** Whether the field is required */
  required?: boolean;
  /** Whether to show an asterisk for required fields */
  showRequiredSign?: boolean;
  /** Tooltip text providing additional information */
  tip?: string;
  /** Error message to display */
  error?: string;

  ref?: any;
  inputRef?: any;
  showSearchIcon?: boolean;
};

/**
 * A base input component with built-in support for labels, tooltips,
 * password visibility toggle, focus states, and value trimming.
 *
 * @component
 * @example
 * ```tsx
 * <Input
 *   label="Username"
 *   placeholder="Enter username"
 *   type="text"
 *   required
 *   tip="Must be at least 3 characters"
 *   onChange={(value) => console.info(value)}
 * />
 * ```
 *
 * @param {InputProps} props - Component props
 * @returns {JSX.Element} A styled input component
 */
export default function Input({
  inputClassName,
  className,
  placeholder,
  label,
  labelClassName,
  type = 'text',
  disabled = false,
  trim = false,
  value = '',
  onChange,
  required = false,
  showRequiredSign = false,
  tip,
  error,
  inputContainerClassName,
  ref,
  inputRef,
  showSearchIcon,
  ...props
}: InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputProps>) {
  const isPassword = type.includes('password');
  const [showPassword, setShowPassword] = useState<boolean>(!isPassword);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleOnChange(text: string) {
    if (disabled || !onChange) return;
    const processedValue = trim ? text.trim() : text;
    onChange(type === 'number' && processedValue ? Number(processedValue) : processedValue);
  }

  return (
    <div ref={ref} className={twMerge('gap-1 grid', className)}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label htmlFor={props.id} className={twMerge('font-bold text-zinc-900', labelClassName)}>
            {label}
          </label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
        </div>
      )}
      <div
        data-focus={isFocused}
        className={twMerge(
          'flex w-full rounded-md border border-zinc-300 bg-background  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline items-center',
          inputContainerClassName
        )}
      >
        {(type === 'search' || showSearchIcon) && (
          <SearchIcon size={18} className='text-zinc-400 ml-2' />
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          onBlur={(e) => {
            props?.onBlur?.(e);
            setIsFocused(false);
          }}
          onFocus={(e) => {
            props?.onFocus?.(e);
            setIsFocused(true);
          }}
          onChange={(e) => handleOnChange(e.currentTarget.value)}
          value={type === 'date' ? value.toString().split('T')[0] || value : value}
          placeholder={placeholder}
          className={twMerge(' p-1 px-2 rounded-md disabled:bg-background w-full', inputClassName)}
          step='any'
          ref={inputRef}
          {...props}
        />
        {isPassword && (
          <span
            onClick={() => !disabled && setShowPassword((prev) => !prev)}
            className='rounded-none bg-white mr-4 cursor-pointer'
          >
            {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
          </span>
        )}
      </div>
      {error && <div className='text-red-500 text-xs'>*{error}</div>}
    </div>
  );
}
