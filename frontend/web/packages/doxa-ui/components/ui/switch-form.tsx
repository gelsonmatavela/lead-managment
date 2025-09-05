import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AsteriskIcon, CircleHelpIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

// Base Switch Component Props
type SwitchProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  label?: string;
  description?: string;
};

// Base Switch Component
function Switch({
  value = true,
  onChange,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  label,
  description,
}: SwitchProps) {
  const switchClasses = [
    'relative',
    'inline-flex',
    'h-5',
    'w-10',
    'items-center',
    'rounded-full',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-1',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    value ? 'bg-primary-500' : 'bg-zinc-200',
    className,
  ].join(' ');

  const toggleClasses = [
    'inline-block',
    'h-3',
    'w-3',
    'rounded-full',
    'bg-white',
    'transform',
    'transition-transform',
    'duration-200',
    value ? 'translate-x-6' : 'translate-x-1',
  ].join(' ');

  return (
    <div className={`flex items-center gap-3 ${containerClassName}`}>
      <button
        role='switch'
        type='button'
        aria-checked={value}
        onClick={() => !disabled && onChange?.(Boolean(!value))}
        className={switchClasses}
        disabled={disabled}
      >
        <span className={toggleClasses} />
      </button>
      {(label || description) && (
        <div className='flex flex-col'>
          {label && (
            <span className={`text-sm font-medium text-zinc-900 ${labelClassName}`}>{label}</span>
          )}
          {description && <span className='text-sm text-zinc-500'>{description}</span>}
        </div>
      )}
    </div>
  );
}

// FormSwitch Component Props
type FormSwitchProps = {
  form: UseFormReturn<any, any, any>;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showRequiredSign?: boolean;
  tip?: string;
  defaultChecked?: boolean;
};

// Form-integrated Switch Component
function FormSwitch({
  form,
  name,
  label,
  description,
  className,
  containerClassName,
  labelClassName,
  required = true,
  disabled = false,
  showRequiredSign = false,
  tip,
  defaultChecked = true,
}: FormSwitchProps) {
  return (
    <div className={twMerge(`gap-1 grid`, className)}>
      <Controller
        control={form.control}
        rules={{
          required: required ? 'Este campo é obrigatório' : false,
        }}
        render={({ field: { onChange, value = defaultChecked } }) => (
          <Switch
            value={value}
            onChange={onChange}
            disabled={disabled}
            containerClassName={containerClassName}
            labelClassName={labelClassName}
            description={description}
          />
        )}
        name={name}
      />
      {(label || required || tip) && (
        <div className='flex flex-row items-center gap-1'>
          {label && (
            <label
              htmlFor={`switch-${name}`}
              className={`font-bold text-zinc-900 ${labelClassName || ''}`}
            >
              {label}
            </label>
          )}
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
          {tip && (
            <div className='ml-auto mr-1 relative group'>
              <CircleHelpIcon size={18} />
              <span className='absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
                {tip}
              </span>
            </div>
          )}
        </div>
      )}

      {getNestedErrorMessage(form.formState.errors, name) && (
        <div className='text-red-500 text-xs'>
          *{getNestedErrorMessage(form.formState.errors, name) as string}
        </div>
      )}
    </div>
  );
}

export { Switch, FormSwitch };
