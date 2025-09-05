'use client';

import { twMerge } from 'tailwind-merge';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import React from 'react';

type Option = {
  value: string | number;
  label: string | React.ReactNode;
};

type SelectWithCheckbBoxProps = {
  selectClassName?: string;
  className?: string;
  name?: string;
  placeholder?: string | React.ReactNode;
  label?: string;
  selectContainerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  options: Option[];
  selectedOptions: any[];
  setSelectedOptions: (opts: any[]) => void;
  selectTriggerClassName?: string;
};

export default function SelectWithCheckbBox({
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
  selectedOptions = [],
  setSelectedOptions,
  onChange,
  selectTriggerClassName,
  ...props
}: SelectWithCheckbBoxProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof SelectWithCheckbBoxProps>) {
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
    <div className={twMerge('relative gap-1 grid', className)} ref={selectRef}>
      <div
        data-focus={isFocused}
        className={twMerge(
          'flex  rounded-md border border-zinc-300 bg-background  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-white md:flex-1 placeholder:text-zinc-300 placeholder:font-normal flex-row data-[focus=true]:outline-primary-500 data-[focus=true]:outline-2 data-[focus=true]:outline',
          selectContainerClassName
        )}
      >
        <div
          aria-label={label}
          id={`select-${name}`}
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocused(!isFocused);
          }}
          className={twMerge(
            'flex md:flex-1 md:w-full h-full p-1 px-2  rounded-md md:justify-between items-center cursor-pointer',
            selectClassName
          )}
        >
          <span>{placeholder}</span>
          <ChevronDown
            className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            size={16}
          />
        </div>
      </div>

      {isOpen && (
        <div className='fixed w-60 right-6 mt-10 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-[99]'>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                if (selectedOptions.includes(option.value))
                  setSelectedOptions(selectedOptions.filter((val) => val !== option.value));
                else setSelectedOptions([...selectedOptions, option.value]);
              }}
              className={twMerge('p-2 cursor-pointer hover:bg-zinc-50 flex justify-between')}
            >
              <span>{option.label}</span>
              <div>
                <input
                  type='checkbox'
                  className='size-4'
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => {
                    if (selectedOptions.includes(option.value))
                      setSelectedOptions(selectedOptions.filter((val) => val !== option.value));
                    else setSelectedOptions([...selectedOptions, option.value]);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
