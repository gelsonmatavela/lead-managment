import React from 'react';
import { ImageIcon, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Base ImageUpload component props
export type ImageUploadProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  tipSpanClassName?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  fileInputClassName?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  error?: string;
  name: string;
};

// Base ImageUpload component
export default function ImageUpload({
  value,
  onChange,
  onError,
  className = '',
  containerClassName = '',
  labelClassName = '',
  tipSpanClassName = '',
  dropzoneClassName = '',
  previewClassName = '',
  fileInputClassName = '',
  disabled = false,
  accept = 'image/*',
  maxSize,
  error,
  name,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFile = (file: File | null) => {
    if (file) {
      if (maxSize && file.size > maxSize) {
        onError?.(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }
      onChange?.(file);
    } else {
      onChange?.(null);
    }
  };

  const dropzoneClasses = [
    'w-full',
    'h-full',
    'border',
    'border-dashed',
    'rounded-lg',
    'flex',
    'items-center',
    'justify-center',
    'bg-white',
    'transition-colors',

    disabled ? 'opacity-50 cursor-not-allowed' : '',
    isDragging ? 'border-primary-500 bg-primary-50' : 'border-zinc-300',
    dropzoneClassName,
  ].join(' ');

  // Handle preview URL
  let previewUrl = null;
  if (value instanceof File) {
    previewUrl = URL.createObjectURL(value);
  } else if (typeof value === 'string') {
    previewUrl = value;
  }

  return (
    <div className={twMerge('relative h-48 aspect-square', containerClassName)}>
      <input
        type='file'
        name={`input-${name}`}
        accept={accept}
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        className={twMerge(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed',
          fileInputClassName
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
          if (!disabled && e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      />

      <div className={dropzoneClasses}>
        {previewUrl ? (
          <div className={`relative w-full h-full ${previewClassName}`}>
            <img src={previewUrl} alt='Preview' className='w-full h-full object-cover rounded-lg' />
            {!disabled && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleFile(null);
                }}
                className='absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors z-20'
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center gap-2 text-zinc-400'>
            <ImageIcon size={24} />
            <span className={twMerge('text-xs text-center p-2', tipSpanClassName)}>
              {disabled ? 'Upload desabilitado' : 'Arraste a imagem aqui ou\nclique para procurar'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
