import React, { useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AsteriskIcon, CircleHelpIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getNestedErrorMessage } from '../pages/components/utils/form.helpers';

// Tipos de documentos aceitos
const DOCUMENT_TYPES = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/plain': '.txt',
  'text/rtf': '.rtf',
  'application/vnd.oasis.opendocument.text': '.odt',
  'application/vnd.oasis.opendocument.spreadsheet': '.ods',
  'application/vnd.oasis.opendocument.presentation': '.odp',
  'text/csv': '.csv',
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

const DEFAULT_ACCEPT = Object.values(DOCUMENT_TYPES).join(',');

type FormDocsInputProps = {
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
  multiple?: boolean;
  tipSpanClassName?: string;
};

// Função para formatar tamanho do arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Função para validar tipo de arquivo
const isValidDocumentType = (file: File, acceptedTypes: string): boolean => {
  if (acceptedTypes === '*/*') return true;

  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const acceptedExtensions = acceptedTypes.split(',').map((ext) => ext.trim().toLowerCase());

  return (
    acceptedExtensions.includes(fileExtension) ||
    (acceptedExtensions.some((ext) => Object.values(DOCUMENT_TYPES).includes(ext)) &&
      Object.keys(DOCUMENT_TYPES).includes(file.type))
  );
};

// Função para converter File para o formato esperado pelo schema
const fileToFileObject = (file: File) => ({
  name: file.name,
  size: file.size,
  type: file.type,
  // Manter referência ao arquivo original se necessário
  file: file,
});

// FormDocsInput component
export default function FormDocsInput({
  inputClassName = '',
  className = '',
  form,
  name,
  label,
  inputContainerClassName = '',
  labelClassName = '',
  required = true,
  showRequiredSign = false,
  tip,
  accept = DEFAULT_ACCEPT,
  maxSize = 100 * 1024 * 1024, // 5MB padrão
  disabled = false,
  multiple = true, // Definido como true por padrão para múltiplos arquivos
  tipSpanClassName = '',
}: FormDocsInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle'
  );

  const handleFiles = (files: FileList | null, onChange: (value: any) => void) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of fileArray) {
      // Validar tipo de arquivo
      if (!isValidDocumentType(file, accept)) {
        form.setError(name, {
          type: 'manual',
          message: `Tipo de arquivo não suportado: ${file.name}`,
        });
        hasError = true;
        continue;
      }

      // Validar tamanho
      if (maxSize && file.size > maxSize) {
        form.setError(name, {
          type: 'manual',
          message: `Arquivo muito grande: ${file.name} (${formatFileSize(
            file.size
          )}). Máximo: ${formatFileSize(maxSize)}`,
        });
        hasError = true;
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setUploadStatus('uploading');

      // Converter arquivos para o formato esperado
      const fileObjects = validFiles.map(fileToFileObject);

      // Obter arquivos existentes e adicionar os novos
      const currentValue = form.getValues(name) || [];
      const updatedFiles = multiple ? [...currentValue, ...fileObjects] : fileObjects;

      // Simular upload (remova este timeout em produção)
      updatedFiles.forEach((file) => {});
      setTimeout(() => {
        setUploadStatus('success');
        onChange(updatedFiles.map((file) => file.file));
        form.clearErrors(name);
      }, 500);
    } else if (hasError) {
      setUploadStatus('error');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFiles(files, onChange);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    handleFiles(e.target.files, onChange);
  };

  const removeFile = (indexToRemove: number, value: any[], onChange: (value: any) => void) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(newFiles.length > 0 ? newFiles : []);
    if (newFiles.length === 0) {
      setUploadStatus('idle');
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>;
      case 'success':
        return <CheckCircle className='h-6 w-6 text-green-500' />;
      case 'error':
        return <AlertCircle className='h-6 w-6 text-red-500' />;
      default:
        return <FileText className='h-8 w-8 text-gray-400' />;
    }
  };

  return (
    <div className={`gap-2 grid ${className}`}>
      {label && (
        <div className='flex flex-row items-center gap-1'>
          <label htmlFor={`input-${name}`} className={`font-bold text-zinc-900 ${labelClassName}`}>
            {label}
          </label>
          {required && showRequiredSign && <AsteriskIcon size={12} color='red' />}
          {tip && (
            <div className='ml-auto mr-1 relative group'>
              <CircleHelpIcon size={18} />
              <span
                className={`absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${tipSpanClassName}`}
              >
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
          validate: (value) => {
            if (required && (!value || value.length === 0)) {
              return 'Pelo menos um arquivo é obrigatório';
            }
            return true;
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const fileArray = Array.isArray(value) ? value : [];
          const hasFiles = fileArray.length > 0;

          return (
            <div className='w-full'>
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                  ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${error ? 'border-red-300 bg-red-50' : ''}
                  ${inputContainerClassName}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, onChange)}
                onClick={() => !disabled && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={accept}
                  multiple={multiple}
                  onChange={(e) => handleInputChange(e, onChange)}
                  className='hidden'
                  disabled={disabled}
                  id={`input-${name}`}
                />

                <div className='space-y-2'>
                  {getStatusIcon()}

                  <div className='text-sm'>
                    <p className='font-medium text-gray-900'>
                      {dragActive
                        ? 'Solte os documentos aqui'
                        : hasFiles
                        ? 'Clique para adicionar mais documentos ou arraste aqui'
                        : 'Clique para selecionar ou arraste documentos'}
                    </p>
                    <p className='text-gray-500 text-xs mt-1'>
                      Suporta: PDF, Word, Excel, PowerPoint, TXT, JPG, PNG
                      {maxSize && ` • Máx: ${formatFileSize(maxSize)} por arquivo`}
                      {multiple && ` • Múltiplos arquivos permitidos`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de arquivos selecionados */}
              {hasFiles && (
                <div className='mt-3 space-y-2'>
                  <div className='text-sm font-medium text-gray-700 mb-2'>
                    {fileArray.length} arquivo{fileArray.length !== 1 ? 's' : ''} selecionado
                    {fileArray.length !== 1 ? 's' : ''}
                  </div>
                  {fileArray.map((fileObj: any, index: number) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-md border'
                    >
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-gray-500 flex-shrink-0' />
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {fileObj.name}
                          </p>
                          <p className='text-xs text-gray-500'>{formatFileSize(fileObj.size)}</p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index, fileArray, onChange);
                        }}
                        disabled={disabled}
                        className='text-red-500 hover:text-red-700 disabled:opacity-50 p-1 flex-shrink-0 ml-2'
                        title='Remover arquivo'
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
