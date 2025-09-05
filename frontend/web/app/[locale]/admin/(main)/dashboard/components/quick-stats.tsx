import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuickStatsProps {
  userMetrics: {
    total: number;
    active: number;
    staff: number;
    superUsers: number;
  };
  companyMetrics: {
    total: number;
    averageStaff: number;
  };
  className?: string;
}

interface StatItemProps {
  label: string;
  value: string | number;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const StatItem = ({ label, value, percentage, trend, color = 'text-primary' }: StatItemProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <div className="text-center p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className={cn("text-2xl font-bold mb-1", color)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs text-gray-400 mb-2">{label}</div>
      {percentage !== undefined && (
        <div className={cn(
          "flex items-center justify-center gap-1 text-xs",
          trend === 'up' && "text-emerald-400",
          trend === 'down' && "text-red-400",
          trend === 'neutral' && "text-gray-400"
        )}>
          <TrendIcon className="w-3 h-3" />
          {percentage.toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default function QuickStats({ userMetrics, companyMetrics, className }: QuickStatsProps) {
  const activityRate = userMetrics.total > 0 ? (userMetrics.active / userMetrics.total) * 100 : 0;
  const staffPercentage = userMetrics.total > 0 ? (userMetrics.staff / userMetrics.total) * 100 : 0;
  const adminPercentage = userMetrics.total > 0 ? (userMetrics.superUsers / userMetrics.total) * 100 : 0;
  const staffPerCompany = companyMetrics.averageStaff;

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Estatísticas Rápidas</h3>
        <div className="text-xs text-gray-400">
          Atualizado agora
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <StatItem
          label="Taxa de Atividade"
          value={`${activityRate.toFixed(1)}%`}
          percentage={activityRate > 80 ? 5.2 : activityRate > 60 ? 2.1 : -1.8}
          trend={activityRate > 80 ? 'up' : activityRate > 60 ? 'neutral' : 'down'}
          color="text-emerald-400"
        />
        
        <StatItem
          label="% Staff"
          value={`${staffPercentage.toFixed(1)}%`}
          percentage={staffPercentage > 20 ? 3.7 : staffPercentage > 10 ? 1.2 : -0.5}
          trend={staffPercentage > 20 ? 'up' : staffPercentage > 10 ? 'neutral' : 'down'}
          color="text-blue-400"
        />
        
        <StatItem
          label="Staff/Empresa"
          value={staffPerCompany.toFixed(1)}
          percentage={staffPerCompany > 5 ? 8.3 : staffPerCompany > 3 ? 4.1 : 1.2}
          trend={staffPerCompany > 5 ? 'up' : staffPerCompany > 3 ? 'neutral' : 'up'}
          color="text-purple-400"
        />
        
        <StatItem
          label="% Admins"
          value={`${adminPercentage.toFixed(1)}%`}
          percentage={adminPercentage > 5 ? -2.1 : adminPercentage > 2 ? 0.8 : 1.5}
          trend={adminPercentage > 5 ? 'down' : adminPercentage > 2 ? 'neutral' : 'up'}
          color="text-yellow-400"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Insights</h4>
        <div className="space-y-2 text-xs text-gray-400">
          {activityRate > 85 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              <span>Excelente taxa de atividade de usuários</span>
            </div>
          )}
          {staffPerCompany > 10 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Empresas bem estruturadas com bom número de staff</span>
            </div>
          )}
          {adminPercentage > 10 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <span>Alto número de admins - considere revisar permissões</span>
            </div>
          )}
          {activityRate < 60 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              <span>Taxa de atividade baixa - engajamento pode melhorar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}