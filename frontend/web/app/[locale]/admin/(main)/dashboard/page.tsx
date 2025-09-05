'use client';

import React from 'react';
import { Users, Building2, Shield, UserCheck } from 'lucide-react';
import { useDashboardData, useDashboardMetrics } from './hooks/dashboard-data';
import { ErrorDashboard, LoadingDashboard } from './components/loading-and-error-components';
import MetricCard from './components/metric-card';
import LeadersAnalytics from './components/leader-analytics';
import UserActivityChart from './components/user-activity-chart';
import UserBreakdown from './components/breakdown';
import RecentActivity from './components/recent-activity';
import CompanyOverview from './components/company-overview';
import QuickStats from './components/quick-stats';
import { cn } from '@/src/lib/utils';
import useSidebar from '@/src/components/azra-ui/sidebar/hooks/use-sidebar-hooks';

export default function AdminDashboard() {
  const { users, companies, staff, roles, loading, error } = useDashboardData();
  const { userMetrics, companyMetrics, leaderMetrics, recentActivity } = useDashboardMetrics(
    users,
    companies,
    staff,
    roles
  );

  const { isCollapsed } = useSidebar();

  if (loading) {
    return <LoadingDashboard />;
  }

  if (error) {
    return <ErrorDashboard error={error} />;
  }
  const userGrowth = 12.5;
  const companyGrowth = 8.3;
  const staffGrowth = 15.7;
  const activityGrowth = 6.2;

  return (
    <div
      className={cn(
        'min-h-screen bg-black transition-all duration-300 ease-out px-6 py-6',
        'ml-0 lg:ml-16',
        !isCollapsed && 'lg:ml-72'
      )}
    >
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-white mb-2'>Dashboard Administrativo</h1>
        <p className='text-gray-400'>
          Visão geral das métricas da plataforma • Atualizado em{' '}
          {new Date().toLocaleString('pt-PT')}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <MetricCard
          icon={Users}
          label='Total de Usuários'
          value={userMetrics.total.toLocaleString()}
          change={userGrowth}
          trend='up'
          description={`${userMetrics.active} ativos, ${userMetrics.inactive} inativos`}
        />

        <MetricCard
          icon={Building2}
          label='Empresas Registradas'
          value={companyMetrics.total.toLocaleString()}
          change={companyGrowth}
          trend='up'
          description={`${companyMetrics.withStaff} com staff ativo`}
        />

        <MetricCard
          icon={UserCheck}
          label='Staff Total'
          value={userMetrics.staff.toLocaleString()}
          change={staffGrowth}
          trend='up'
          description={`Média: ${companyMetrics.averageStaff} por empresa`}
        />

        <MetricCard
          icon={Shield}
          label='Super Usuários'
          value={userMetrics.superUsers.toLocaleString()}
          change={activityGrowth}
          trend='up'
          description={`${((userMetrics.superUsers / userMetrics.total) * 100).toFixed(
            1
          )}% do total`}
        />
      </div>
      {/* 
      <div className="mb-8">
        <LeadersAnalytics leaderMetrics={leaderMetrics} />
      </div> */}

      <div className='grid lg:grid-cols-3 gap-6 mb-8'>
        <UserActivityChart users={users} className='lg:col-span-1' />

        <UserBreakdown users={users} staff={staff} className='lg:col-span-1' />

        <RecentActivity activities={recentActivity} className='lg:col-span-1' />
      </div>

      <div className='grid lg:grid-cols-2 gap-6'>
        <CompanyOverview companies={companies} staff={staff} />

        <QuickStats userMetrics={userMetrics} companyMetrics={companyMetrics} />
      </div>
    </div>
  );
}
