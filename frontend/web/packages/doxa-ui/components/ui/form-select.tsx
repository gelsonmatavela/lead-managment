'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { useState, useRef, useEffect } from 'react';
import { AsteriskIcon, ChevronDown } from 'lucide-react';
import React from 'react';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

type Option = {
  value: string | number;
  label: string | React.ReactNode;
};

type FormSelectProps = {
  selectClassName?: string;
  className?: string;
  form: UseFormReturn<any, any, any>;
  name: string;
  placeholder?: string;
  label?: string;
  selectContainerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  disabled?: boolean;
  options: Option[];
};

export default function FormSelect({
  selectClassName,
  className,
  form,
  name,
  placeholder = 'Selecionar...',
  label,
  selectContainerClassName,
  labelClassName,
  required = true,
  showRequiredSign = false,
  disabled = false,
  options,
  ...props
}: FormSelectProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof FormSelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={twMerge('gap-1 grid', className)}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label
            htmlFor={`select-${name}`}
            className={twMerge('font-bold text-zinc-900', labelClassName)}
          >
            {label}
          </label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
        </div>
      )}
      <Controller
        control={form.control}
        rules={{
          required: 'Este campo é obrigátorio',
        }}
        render={({ field: { onChange, value = props.defaultValue } }) => (
          <div className={twMerge('relative', selectContainerClassName)} ref={selectRef}>
            <div
              data-focus={isFocused}
              className={twMerge(
                'flex w-full rounded-md border border-zinc-300 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline md:text-sm',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <div
                aria-label={label}
                id={`form-select-${name}`}
                onClick={() => {
                  if (!disabled) {
                    setIsOpen(!isOpen);
                    setIsFocused(!isFocused);
                  }
                }}
                className={twMerge(
                  'flex flex-1 w-full h-full p-2 px-2 rounded-md justify-between items-center',
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  selectClassName
                )}
              >
                <span
                  id={`form-select-${name}-span`}
                  className={!value ? 'text-zinc-400' : 'truncate'}
                >
                  {options.find((opt) => opt.value === value)?.label || placeholder}
                </span>
                <ChevronDown
                  className={twMerge(
                    'transition-transform duration-200',
                    isOpen && !disabled ? 'transform rotate-180' : '',
                    disabled && 'opacity-50'
                  )}
                  size={16}
                />
              </div>
            </div>

            {isOpen && !disabled && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                {options.map((option, i) => (
                  <div
                    key={option.value}
                    id={`form-select-${name}-option-${i}`}
                    className={twMerge(
                      `p-2 cursor-pointer hover:bg-zinc-50 ${name}-dropdown-option`,
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
        )}
        name={name}
      />

      {getNestedErrorMessage(form.formState.errors, name) && (
        <div className='text-red-500 text-xs'>
          *{getNestedErrorMessage(form.formState.errors, name) as string}
        </div>
      )}
    </div>
  );
}
