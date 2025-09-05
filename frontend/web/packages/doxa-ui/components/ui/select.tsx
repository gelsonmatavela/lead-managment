'use client';

import { twMerge } from 'tailwind-merge';
import { useState, useRef, useEffect } from 'react';
import { AsteriskIcon, ChevronDown } from 'lucide-react';
import React from 'react';

/**
 * Represents an option in the select dropdown.
 */
type Option = {
  /** The value of the option. */
  value: string | number;
  /** The label displayed for the option. Can be a string or a React node. */
  label: string | React.ReactNode;
};

/**
 * Props for the Select component.
 */
type SelectProps = {
  /** Additional CSS classes for the select input. */
  selectClassName?: string;
  /** Additional CSS classes for the root container. */
  className?: string;
  /** The name of the select input. */
  name?: string;
  /** Placeholder text displayed when no option is selected. */
  placeholder?: string;
  /** Label text for the select input. */
  label?: string;
  /** Additional CSS classes for the select container. */
  selectContainerClassName?: string;
  /** Additional CSS classes for the label. */
  labelClassName?: string;
  /** Whether the select input is required. */
  required?: boolean;
  /** Whether to show a red asterisk for required fields. */
  showRequiredSign?: boolean;
  /** The list of options to display in the dropdown. */
  options: Option[];
  /** The currently selected value. */
  value: string | number;
  /** Callback function triggered when the selected value changes. */
  onChange: (value: string | number) => void;

  children?: React.ReactNode;

  valueSpanClassName?: string;
};

/**
 * A customizable select dropdown component.
 * Supports labels, placeholders, required fields, and custom options with smart positioning.
 */
export default function Select({
  selectClassName,
  className,
  name,
  placeholder,
  label,
  selectContainerClassName,
  labelClassName,
  required = true,
  showRequiredSign = false,
  options,
  value,
  onChange,
  children,
  valueSpanClassName,
  ...props
}: SelectProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof SelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (!selectRef.current) return;

    const selectRect = selectRef.current.getBoundingClientRect();
    const dropdownHeight = options.length * 40; // Approximate height based on item count
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - selectRect.bottom;

    // If space below is insufficient and space above is more than below
    if (spaceBelow < dropdownHeight && selectRect.top > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
    setIsFocused(!isFocused);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recalculate position on window resize if dropdown is open
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className={twMerge('gap-1 grid', className)}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label className={twMerge('font-bold text-zinc-900', labelClassName)}>{label}</label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
        </div>
      )}

      <div className={twMerge('relative')} ref={selectRef}>
        <div
          data-focus={isFocused}
          className={twMerge(
            'flex rounded-md border border-zinc-300 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline',
            selectContainerClassName
          )}
        >
          {children}
          <div
            aria-label={label}
            id={`select-${name}`}
            onClick={toggleDropdown}
            className={twMerge(
              'flex flex-1 w-full h-full p-1 px-2 rounded-md justify-between items-center cursor-pointer gap-3',
              selectClassName
            )}
          >
            <span className={`${!value ? 'text-zinc-400' : 'truncate'} ${valueSpanClassName}`}>
              {options.find((opt) => opt.value === value)?.label || placeholder}
            </span>
            <ChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              size={16}
            />
          </div>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={twMerge(
              'absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto',
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
            )}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={twMerge(
                  'p-2 cursor-pointer hover:bg-zinc-50',
                  value === option.value && 'bg-zinc-100'
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setIsFocused(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
