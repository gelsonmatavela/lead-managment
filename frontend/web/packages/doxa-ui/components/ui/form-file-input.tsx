import { Controller, UseFormReturn } from 'react-hook-form';
import ImageUpload, { ImageUploadProps } from './file-input';
import { AsteriskIcon, CircleHelpIcon } from 'lucide-react';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

// ImageFileInputprops (matching FormInput pattern)
type ImageFileInputProps = {
  inputClassName?: string;
  className?: string;
  form: UseFormReturn<any, any, any>;
  name: string;
  label?: string;
  inputContainerClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  tip?: string;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
};

// ImageFileInputcomponent
export default function ImageFileInput({
  inputClassName,
  className,
  form,
  name,
  label,
  inputContainerClassName,
  labelClassName,
  required = true,
  showRequiredSign = false,
  tip,
  accept = 'image/*',
  maxSize,
  disabled = false,
  tipSpanClassName = '',
  fileInputClassName = '',
}: ImageFileInputProps & Partial<ImageUploadProps>) {
  return (
    <div className={`gap-1 grid ${className || ''}`}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label
            htmlFor={`input-${name}`}
            className={`font-bold text-zinc-900 ${labelClassName || ''}`}
          >
            {label}
          </label>
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

      <Controller
        control={form.control}
        rules={{
          required: required ? 'Este campo é obrigatório' : false,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <ImageUpload
              name={name}
              value={value}
              onChange={onChange}
              onError={(errorMessage) => {
                form.setError(name, {
                  type: 'manual',
                  message: errorMessage,
                });
              }}
              containerClassName={inputContainerClassName}
              fileInputClassName={fileInputClassName}
              className={inputClassName}
              disabled={disabled}
              accept={accept}
              maxSize={maxSize}
              error={error?.message}
              tipSpanClassName={tipSpanClassName}
            />
          );
        }}
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
