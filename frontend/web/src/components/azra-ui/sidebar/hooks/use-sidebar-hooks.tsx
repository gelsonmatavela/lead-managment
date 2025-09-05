'use client'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  activeItem: string | null;
  expandedDropdowns: string[];
  setCollapsed: (collapsed: boolean) => void;
  setActiveItem: (item: string) => void;
  toggleDropdown: (dropdownId: string) => void;
  setExpandedDropdowns: (dropdowns: string[]) => void;
}

const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      activeItem: null,
      expandedDropdowns: [],
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setActiveItem: (item) => set({ activeItem: item }),
      toggleDropdown: (dropdownId) => {
        const { expandedDropdowns } = get();
        const isExpanded = expandedDropdowns.includes(dropdownId);

        if (isExpanded) {
          set({
            expandedDropdowns: expandedDropdowns.filter(id => id !== dropdownId)
          });
        } else {
          set({
            expandedDropdowns: [...expandedDropdowns, dropdownId]
          });
        }
      },
      setExpandedDropdowns: (dropdowns) => set({ expandedDropdowns: dropdowns }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

function useSidebar() {
  const {
    isCollapsed,
    activeItem,
    expandedDropdowns,
    setCollapsed,
    setActiveItem,
    toggleDropdown,
    setExpandedDropdowns,
  } = useSidebarStore();

  const toggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };

  const openSidebar = () => {
    setCollapsed(false);
  };

  const closeSidebar = () => {
    setCollapsed(true);
  };

  const isDropdownExpanded = (dropdownId: string) => {
    return expandedDropdowns.includes(dropdownId);
  };

  const collapseAllDropdowns = () => {
    setExpandedDropdowns([]);
  };

  const autoCloseOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  // Retornar apenas as funções e estados necessários
  return {
    // Estados
    isCollapsed,
    activeItem,
    expandedDropdowns,
    
    // Funções básicas
    setCollapsed,
    setActiveItem,
    toggleDropdown,
    toggleSidebar,
    
    // Funções utilitárias
    isDropdownExpanded,
    collapseAllDropdowns,
    
    // Funções extras
    openSidebar,
    closeSidebar,
    autoCloseOnMobile,
  };
}

export default useSidebar;