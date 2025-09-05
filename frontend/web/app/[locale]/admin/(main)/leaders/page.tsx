'use client';

import React, { useState, useEffect } from 'react';
import useSidebar from '@/src/components/azra-ui/sidebar/hooks/use-sidebar-hooks';
import { userFilteringFields } from '@/src/filtering-fields/user-filtering-fields';
import { cn } from '@/src/lib/utils';
import { Crown, Users, Filter } from 'lucide-react';
import ListPage from '@/packages/doxa-ui/components/pages/list-page';

export default function LeadersListPage() {
  const { isCollapsed } = useSidebar();
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showOnlyLeaders, setShowOnlyLeaders] = useState(true);

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
    const baseParams = {
      sort: 'name',
      filterMode: 'AND',
      limit: screenSize === 'sm' ? 10 : screenSize === 'md' ? 15 : 20,
    };

    if (showOnlyLeaders) {
      return {
        ...baseParams,
        roles: {
          some: {
            role: {
              name: 'Leader'
            }
          }
        }
      };
    }

    return baseParams;
  };
  const leaderFilteringFields = [
    ...userFilteringFields,
    {
      name: 'roleFilter',
      field: 'roles.some.role.name',
      label: 'Função',
      inputType: 'select' as const,
      prismaField: 'roles.some.role.name',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Líderes', value: 'Leader' },
        { label: 'Staff', value: 'Staff' },
        { label: 'Super Admin', value: 'SuperAdmin' }
      ]
    },
    {
      name: 'companyFilter',
      field: 'staff.company.name',
      label: 'Empresa',
      inputType: 'text' as const,
      prismaField: 'staff.company.name',
      placeholder: 'Nome da empresa'
    }
  ];

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
            title={showOnlyLeaders ? 'Líderes das Empresas' : 'Lista de Usuários'}
            description={showOnlyLeaders 
              ? 'Gerencie líderes e suas responsabilidades nas empresas'
              : 'Gerencie usuários, roles e permissões do sistema'
            }
            Icon={showOnlyLeaders ? Crown : Users}
            filteringFields={showOnlyLeaders ? leaderFilteringFields : userFilteringFields}
            params={getResponsiveParams()}
            className="w-full"
            customColumns={showOnlyLeaders ? [
              {
                key: 'name',
                label: 'Nome',
                render: (user: any) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                )
              },
              {
                key: 'company',
                label: 'Empresa',
                render: (user: any) => (
                  <div>
                    <p className="text-sm text-white">{user.staff?.company?.name || '-'}</p>
                    <p className="text-xs text-gray-400">{user.staff?.companyCode || '-'}</p>
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (user: any) => (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    user.isActive 
                      ? "bg-green-900/30 text-green-300"
                      : "bg-red-900/30 text-red-300"
                  )}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                )
              },
              {
                key: 'lastLogin',
                label: 'Último Login',
                render: (user: any) => (
                  <span className="text-sm text-gray-300">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('pt-PT')
                      : 'Nunca'
                    }
                  </span>
                )
              }
            ] : undefined}
          />
        </div>
      </div>
    </div>
  );
}