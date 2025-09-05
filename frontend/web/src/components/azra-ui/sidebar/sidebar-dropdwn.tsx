'use client';

import React from 'react';
import { ChevronDown, Plus, LucideIcon } from 'lucide-react';
import useSidebar from './hooks/use-sidebar-hooks';
import { cn } from '@/src/lib/utils';
import SidebarItem from './sidebar-item';

interface DropdownItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  href?: string;
  onClick?: () => void;
}

interface SidebarDropdownProps {
  id: string;
  title: string;
  items: DropdownItem[];
  canAddNew?: boolean;
  onAddNew?: () => void;
  addNewLabel?: string;
  className?: string;
}

export default function SidebarDropdown({
  id,
  title,
  items,
  canAddNew = false,
  onAddNew,
  addNewLabel = "Add New",
  className,
}: SidebarDropdownProps) {
  const { isCollapsed, isDropdownExpanded, toggleDropdown } = useSidebar();
  
  const isExpanded = isDropdownExpanded(id);

  const handleToggle = () => {
    if (!isCollapsed) {
      toggleDropdown(id);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Dropdown Header */}
      {!isCollapsed && (
        <>
          <button
            onClick={handleToggle}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors duration-200"
          >
            <span>{title}</span>
            <ChevronDown 
              size={14} 
              className={cn(
                "transition-transform duration-200",
                isExpanded ? "rotate-180" : "rotate-0"
              )}
            />
          </button>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-3" />
        </>
      )}

      {/* Dropdown Items */}
      <div className={cn(
        "space-y-1 transition-all duration-300 ease-in-out",
        !isCollapsed && !isExpanded && "max-h-0 overflow-hidden opacity-0",
        !isCollapsed && isExpanded && "max-h-96 opacity-100",
        isCollapsed && "opacity-100"
      )}>
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            count={item.count}
            href={item.href}
            onClick={item.onClick}
            className={!isCollapsed ? "ml-2" : ""}
          />
        ))}
        
        {/* Add New Button */}
        {canAddNew && onAddNew && (!isCollapsed ? isExpanded : true) && (
          <button
            onClick={handleAddNew}
            className={cn(
              "group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200",
              "text-gray-400 hover:text-orange-300 hover:bg-white/5",
              "border border-dashed border-gray-600 hover:border-orange-500/50",
              !isCollapsed && "ml-2",
              isCollapsed && "justify-center px-2"
            )}
          >
            <div className="flex items-center gap-3">
              <Plus 
                size={16} 
                className="transition-colors duration-200 group-hover:text-orange-400"
              />
              {!isCollapsed && (
                <span className="text-xs font-medium transition-colors duration-200">
                  {addNewLabel}
                </span>
              )}
            </div>
            
            {/* Tooltip para quando collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-gray-700">
                {addNewLabel}
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}