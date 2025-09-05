'use client';

import React, { useState, useEffect } from 'react';
import useSidebar from '@/src/components/azra-ui/sidebar/hooks/use-sidebar-hooks';
import { userFilteringFields } from '@/src/filtering-fields/user-filtering-fields';
import { cn } from '@/src/lib/utils';
import { Users } from 'lucide-react';
import ListPage from '@/packages/doxa-ui/components/pages/list-page';

export default function UsersListPage() {
  const { isCollapsed } = useSidebar();
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const getResponsiveParams = () => {
    return {
      sort: 'name',
      filterMode: 'AND',
      limit: screenSize === 'sm' ? 10 : screenSize === 'md' ? 15 : 20,
    };
  };

  const responsiveClasses = {
    container: cn(
      'min-h-screen bg-gray-950 transition-all duration-300 ease-out',
      'ml-0 lg:ml-16',
      !isCollapsed && 'lg:ml-72',
      screenSize === 'sm' ? 'p-2' : 
      screenSize === 'md' ? 'p-4' : 
      'p-4 sm:p-6 lg:p-8'
    ),
    innerContainer: cn(
      'flex-1 w-full',
      screenSize === 'sm' ? 'mx-auto' : 'mx-auto max-w-7xl'
    ),
    card: cn(
      'bg-black border border-gray-800/50 rounded-xl',
      screenSize === 'sm' ? 'p-3' :
      screenSize === 'md' ? 'p-4' :
      'p-4 sm:p-6 lg:p-8',
      screenSize === 'sm' ? 'min-h-[60vh]' : 'min-h-[70vh]'
    )
  };

  return (
    <div className={responsiveClasses.container}>
      <div className={responsiveClasses.innerContainer}>
        <div className={responsiveClasses.card}>
          <ListPage
            name='user'
            title={screenSize === 'sm' ? 'Usuários' : 'Lista de Usuários'}
            description={
              screenSize === 'sm' 
                ? 'Gerencie usuários e permissões' 
                : 'Gerencie usuários, roles e permissões do sistema'
            }
            Icon={Users}
            filteringFields={userFilteringFields.filter((field) => field.name !== 'staffProfile')}
            params={getResponsiveParams()}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}