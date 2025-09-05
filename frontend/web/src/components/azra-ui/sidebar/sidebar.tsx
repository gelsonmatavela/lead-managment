'use client';

import React from 'react';
import { 
  TrendingUp, 
  Settings, 
  Calendar,
  Hash,
  Circle,
  Play,
  CheckCircle,
  Target,
  Zap,
  Palette,
  Menu,
  X,
  UserRoundPlus,
  Square,
} from 'lucide-react';
import useSidebar from './hooks/use-sidebar-hooks';
import { cn } from '@/src/lib/utils';
import SidebarItem from './sidebar-item';
import SidebarDropdown from './sidebar-dropdwn';
import Logo from '../../ui/logo';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const translateSidebar = useTranslations("layout.sidebar");
  
  const { 
    isCollapsed, 
    toggleSidebar 
  } = useSidebar();

  const mainNavItems = [
    {
      id: 'dashboard',
      label: translateSidebar("main-nav-items.dashboard"),
      icon: Square ,
      href: '/admin/dashboard',
    },
    // {
    //   id: 'settings',
    //   label: translateSidebar("main-nav-items.settings"),
    //   icon: Settings,
    //   href: '/admin/settings',
    // },
  ];

  const usersIContent = [
    {
      id: 'all-users',
      label: translateSidebar("user-content.all-users"),
      icon: Hash,
      count: 4,
      href: '/admin/leaders',
    },
    {
      id: 'create-leader',
      label: translateSidebar("user-content.create-user"),
      icon: UserRoundPlus,
      count: 0,
      href: '/admin/leades/create-leader',
    },
  ];

  const handleLogoClick = () => {
    toggleSidebar();
  };

  return (
    <>
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full bg-black backdrop-blur-xl border-r border-gray-800/50 z-50 transition-all duration-300 ease-out",
        "flex flex-col shadow-2xl",
        isCollapsed ? "w-14 sm:w-16" : "w-64 xs:w-72",
        "lg:translate-x-0",
        !isCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        
        <div className={cn(
          "flex items-center justify-between p-3 sm:p-4 border-b border-gray-800/50",
          isCollapsed && "justify-center px-2 sm:px-3"
        )}>
          
          {!isCollapsed && (
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 active:opacity-60 transition-all duration-200 group"
              title="Fechar sidebar"
              data-id = "open-sidebar-btn"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br rounded-lg flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform duration-200">
                <Logo />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-gray-200 transition-colors duration-200">
                 LEAD MANANGEMENT
              </h1>
            </button>
          )}
          
          {isCollapsed && (
            <button
              onClick={handleLogoClick}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
              title="Abrir sidebar"
              data-id = "close-sidebar-btn"
            >
              <Logo />
            </button>
          )}
          
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 sm:p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors duration-200 text-gray-400 hover:text-white lg:hidden"
              title="Fechar sidebar"
              data-id = "close02-sidebar-btn"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 sm:space-y-6">
          
          <nav className="space-y-0.5 sm:space-y-1">
            {mainNavItems.map((item) => (
              <SidebarItem
                key={item.id}
                id={item.id}
                label={item.label}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </nav>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          <div className="space-y-4 sm:space-y-6">
            <SidebarDropdown
              id="opportunities"
              title={translateSidebar("user-content.title")}
              items={usersIContent}
            />
           
          </div>
        </div>

        <div className={cn(
          "border-t border-gray-800/50 p-3 sm:p-4",
          isCollapsed && "px-2 sm:px-3"
        )}>
          {!isCollapsed ? (
            <div className="text-xs text-gray-500 text-center">
              © 2025  LEAD MANANGEMENTS
            </div>
          ) : (
            <div className="w-full h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full opacity-50" />
          )}
        </div>
      </aside>

      {isCollapsed && (
        <button
          onClick={handleLogoClick}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-colors duration-200 text-gray-400 hover:text-white hidden lg:block"
          title="Abrir sidebar"
          data-id = "open02-sidebar-btn"
        >
          <Menu size={18} />
        </button>
      )}
    </>
  );
}