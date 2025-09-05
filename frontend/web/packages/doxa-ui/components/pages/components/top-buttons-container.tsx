'use client';

import Button from '@/packages/doxa-ui/components/ui/button';
import { PlusIcon, FileDownIcon, LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ListPageTemplateProps } from './list-page-template';
import { ListPageProps } from '../list-page';
import { downloadCSV } from '@/packages/doxa-ui/utils/helpers/export';
import { singular } from 'pluralize';
import ProtectedButton from '@/packages/mesquita-ui/components/protected-button';
import { cn } from '@/src/lib/utils';

export type ButtonConfig = {
  Icon: LucideIcon;
  text: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showOnMobile?: boolean;
};

type TopButton = React.ReactNode | ButtonConfig;

type TopButtonsContainer<T> = {
  selectedItem: any;
  deleteData: any;
  triggerReloadAgain?: (() => void) | undefined;
  csvData: Record<string, string | number | boolean>[];
  name: string;
  topButtons?: TopButton[];
} & Partial<ListPageTemplateProps<T>>;

export default function TopButtonsContainer<T>({
  topButtons,
  onClickCreate,
  csvData,
  name,
  onClickUpdate,
}: TopButtonsContainer<T> & Partial<ListPageProps<T>>) {
  const pathname = usePathname();

  // Button variant styles
  const getButtonVariantClass = (variant: ButtonConfig['variant'] = 'ghost') => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 shadow-sm hover:shadow-md',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-700 hover:border-gray-600 shadow-sm hover:shadow-md',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 hover:border-emerald-700 shadow-sm hover:shadow-md',
      warning: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 hover:border-amber-700 shadow-sm hover:shadow-md',
      danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 shadow-sm hover:shadow-md',
      ghost: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border-gray-700/50 hover:border-gray-600/50'
    };
    return variants[variant];
  };

  const renderButton = (button: TopButton, index: number) => {
    // If it's a JSX element, render it directly
    if (React.isValidElement(button)) {
      return <div key={index}>{button}</div>;
    }

    // If it's a button configuration object
    if (typeof button === 'object' && button !== null && 'Icon' in button) {
      const { 
        Icon, 
        text, 
        onClick, 
        href, 
        className = '', 
        variant = 'ghost',
        size = 'md',
        disabled = false,
        showOnMobile = true
      } = button as ButtonConfig;

      const sizeClasses = {
        sm: 'h-[32px] px-3 text-xs',
        md: 'h-[38px] px-4 text-sm',
        lg: 'h-[44px] px-6 text-base'
      };

      return (
        <Button
          key={index}
          onClick={onClick}
          disabled={disabled}
          {...(href && !onClick && { href })}
          className={cn(
            'transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950',
            
            sizeClasses[size],
            'sm:w-auto w-[62px]',
            
            getButtonVariantClass(variant),
            
            !showOnMobile && 'hidden sm:flex',
            
            disabled && 'opacity-50 cursor-not-allowed',
            
            className
          )}
        >
          <Icon size={18} />
          <span className="hidden lg:inline">{text}</span>
        </Button>
      );
    }

    return <div key={index}>{button}</div>;
  };

  return (
    <div className="flex items-center justify-between small-sm:mb-2 overflow-auto xs:pt-2">
      <div className="flex items-center gap-2">
        
        <Button 
          onClick={() => downloadCSV(csvData, name)} 
          className={cn(
            'h-[38px] sm:w-auto w-[62px] transition-all duration-200 font-medium',
            getButtonVariantClass('success')
          )}
        >
          <FileDownIcon size={18} />
          <span className="hidden lg:inline">Exportar</span>
        </Button>

        <ProtectedButton
          resource={singular(name)}
          action="create"
          onNoPermission="hide"
          onClick={onClickCreate}
          {...(!onClickCreate && { href: `${pathname}/create` })}
          className={cn(
            'h-[38px] sm:w-auto w-[62px] transition-all duration-200 font-medium',
            getButtonVariantClass('primary')
          )}
        >
          <PlusIcon size={18} />
          <span className="hidden lg:inline">Adicionar</span>
        </ProtectedButton>

        {topButtons && topButtons.map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );
}

export const createButtonConfig = (
  Icon: LucideIcon,
  text: string,
  onClick: () => void,
  variant: ButtonConfig['variant'] = 'ghost',
  options?: Partial<ButtonConfig>
): ButtonConfig => ({
  Icon,
  text,
  onClick,
  variant,
  ...options
});

export const ButtonConfigs = {
  create: (onClick: () => void, text = 'Criar'): ButtonConfig => 
    createButtonConfig(PlusIcon, text, onClick, 'primary', { showOnMobile: true }),
  
  import: (onClick: () => void, text = 'Importar'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Upload, text, onClick, 'secondary'),
  
  configure: (onClick: () => void, text = 'Configurar'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Settings, text, onClick, 'secondary'),
  
  export: (onClick: () => void, text = 'Exportar'): ButtonConfig => 
    createButtonConfig(FileDownIcon, text, onClick, 'success'),
  
  save: (onClick: () => void, text = 'Salvar'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Save, text, onClick, 'success'),
  
  bulkAction: (onClick: () => void, text = 'Ação em Lote'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Layers, text, onClick, 'warning'),
  
  delete: (onClick: () => void, text = 'Excluir'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Trash2, text, onClick, 'danger'),
  
  filter: (onClick: () => void, text = 'Filtrar'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Filter, text, onClick, 'ghost'),
  
  view: (onClick: () => void, text = 'Visualizar'): ButtonConfig => 
    createButtonConfig(require('lucide-react').Eye, text, onClick, 'ghost'),
};

export interface EnhancedButtonConfig extends ButtonConfig {
  tooltip?: string;
  loading?: boolean;
  badge?: string | number;
}

export const renderEnhancedButton = (config: EnhancedButtonConfig, index: number) => {
  const { loading, badge, tooltip, ...buttonProps } = config;
  
  return (
    <div key={index} className="relative" title={tooltip}>
      <Button
        className={cn(
          buttonProps.className,
          loading && 'opacity-70 cursor-wait'
        )}
        disabled={buttonProps.disabled || loading}
        onClick={buttonProps.onClick}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <buttonProps.Icon size={18} />
        )}
        <span className="hidden lg:inline">{buttonProps.text}</span>
        
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </Button>
    </div>
  );
};