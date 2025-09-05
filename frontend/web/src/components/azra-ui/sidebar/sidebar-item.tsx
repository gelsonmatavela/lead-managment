import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import useSidebar from './hooks/use-sidebar-hooks';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  count?: number;
  badge?: string;
  disabled?: boolean;
  className?: string;
}

export default function SidebarItem({
  id,
  label,
  icon: Icon,
  href,
  count,
  badge,
  disabled = false,
  className
}: SidebarItemProps) {
  const pathname = usePathname();
  const { isCollapsed, setActiveItem, autoCloseOnMobile } = useSidebar();
  
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const handleClick = () => {
    // Definir o item ativo
    setActiveItem(id);
    
    // Auto-close em mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        autoCloseOnMobile();
      }, 100);
    }
  };

  if (disabled) {
    return (
      <div className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg cursor-not-allowed opacity-50',
        'text-gray-500',
        className
      )}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
        isActive 
          ? 'bg-orange-500/20 text-orange-400 shadow-sm' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50',
        isCollapsed && 'justify-center px-2',
        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn(
        'flex-shrink-0 transition-colors duration-200 w-5 h-5',
        isActive 
          ? 'text-orange-400' 
          : 'text-gray-400 group-hover:text-white'
      )} />
      
      {!isCollapsed && (
        <>
          <span className="text-sm font-medium truncate flex-1">
            {label}
          </span>
          
          {/* Count badge */}
          {typeof count === 'number' && count > 0 && (
            <span className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full',
              isActive 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
            )}>
              {count}
            </span>
          )}
          
          {/* Custom badge */}
          {badge && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
      
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
      )}
      
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-gray-900 border-y-4 border-y-transparent" />
        </div>
      )}
    </Link>
  );
}