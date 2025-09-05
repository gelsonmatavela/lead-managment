import React, { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AsteriskIcon, CircleHelpIcon, Upload, X, FileIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

type FormMultipleFileInputProps = {
  form: UseFormReturn<any, any, any>;
  name: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  disabled?: boolean;
  tip?: string;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
};

export default function FormMultipleFileInput({
  form,
  name,
  label,
  className,
  inputClassName,
  labelClassName,
  required = false,
  showRequiredSign = false,
  disabled = false,
  tip,
  accept = '*/*',
  maxSize,
  maxFiles = 10,
  multiple = true,
}: FormMultipleFileInputProps) {
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (files: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (maxSize && file.size > maxSize) {
        errors.push(`${file.name}: Arquivo muito grande (máximo ${formatFileSize(maxSize)})`);
      } else {
        validFiles.push(file);
      }
    });

    return { valid: validFiles, errors };
  };

  const handleFiles = (
    newFiles: FileList | null,
    currentFiles: File[] = [],
    onChange: (files: File[]) => void
  ) => {
    if (!newFiles) return;

    const { valid: validFiles, errors } = validateFiles(newFiles);

    if (errors.length > 0) {
      errors.forEach((error) => {
        form.setError(name, {
          type: 'manual',
          message: error,
        });
      });
    }

    const allFiles = [...currentFiles, ...validFiles];

    if (maxFiles && allFiles.length > maxFiles) {
      form.setError(name, {
        type: 'manual',
        message: `Máximo de ${maxFiles} arquivos permitidos`,
      });
      return;
    }

    onChange(allFiles);
  };

  const removeFile = (index: number, currentFiles: File[], onChange: (files: File[]) => void) => {
    const newFiles = currentFiles.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className={twMerge('gap-1 grid', className)}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label
            htmlFor={`file-input-${name}`}
            className={twMerge('font-bold text-zinc-900', labelClassName)}
          >
            {label}
          </label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
          {tip && (
            <div className='ml-auto mr-1 relative group'>
              <CircleHelpIcon size={18} />
              <span className='absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10'>
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
        render={({ field: { onChange, value = [] }, fieldState: { error } }) => (
          <div className='space-y-3'>
            {/* File Input Area */}
            <div
              className={twMerge(
                'relative border-2 border-dashed rounded-lg p-6 transition-colors',
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400',
                error && 'border-red-500',
                inputClassName
              )}
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled) setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (!disabled && e.dataTransfer.files) {
                  handleFiles(e.dataTransfer.files, value, onChange);
                }
              }}
            >
              <input
                id={`file-input-${name}`}
                type='file'
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(e) => handleFiles(e.target.files, value, onChange)}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed'
              />

              <div className='flex flex-col items-center justify-center space-y-2'>
                <Upload size={32} className='text-gray-400' />
                <div className='text-center'>
                  <p className='text-sm text-gray-600'>
                    {disabled
                      ? 'Upload desabilitado'
                      : 'Arraste arquivos aqui ou clique para procurar'}
                  </p>
                  {maxSize && (
                    <p className='text-xs text-gray-500 mt-1'>
                      Tamanho máximo: {formatFileSize(maxSize)}
                    </p>
                  )}
                  {maxFiles && <p className='text-xs text-gray-500'>Máximo {maxFiles} arquivos</p>}
                </div>
              </div>
            </div>

            {/* File List */}
            {value && value.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700'>
                  Arquivos selecionados ({value.length})
                </p>
                <div className='space-y-1'>
                  {value.map((file: File, index: number) => (
                    <div
                      key={`${file.name}-${index}`}
                      className='flex items-center justify-between p-2 bg-gray-50 rounded border'
                    >
                      <div className='flex items-center space-x-2 flex-1 min-w-0'>
                        <FileIcon size={16} className='text-gray-500 flex-shrink-0' />
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 truncate'>{file.name}</p>
                          <p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      {!disabled && (
                        <button
                          type='button'
                          onClick={() => removeFile(index, value, onChange)}
                          className='ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0'
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
