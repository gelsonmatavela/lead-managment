// components/dashboard/UserActivityChart.tsx
import React, { useMemo } from 'react';

interface UserActivityChartProps {
  users: any;
  className?: string;
}

export default function UserActivityChart({ users, className }: UserActivityChartProps) {
  const activityData = useMemo(() => {
    const userList = users?.data || [];
    const activeUsersCount = userList.filter((u: any) => u.isActive).length;
    
    // Generate activity data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      // Simulate activity data - in real app, this would come from actual activity logs
      const baseActivity = Math.floor(Math.random() * activeUsersCount * 0.8) + activeUsersCount * 0.2;
      
      return {
        day: date.toLocaleDateString('pt-PT', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        active: Math.floor(baseActivity),
        total: userList.length
      };
    });
    
    return last7Days;
  }, [users]);

  if (!users?.data?.length) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade de Usuários</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum dado disponível</p>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...activityData.map(d => d.active));

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Atividade de Usuários</h3>
          <p className="text-sm text-gray-400">Últimos 7 dias</p>
        </div>
        <div className="text-sm text-gray-400">
          Média: {Math.round(activityData.reduce((acc, day) => acc + day.active, 0) / activityData.length)}
        </div>
      </div>
      
      <div className="h-32 sm:h-48 flex items-end justify-between gap-2 sm:gap-3">
        {activityData.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
            <div className="w-full relative group">
              <div
                className="w-full bg-gray-700/30 rounded-sm"
                style={{ height: '120px' }}
              />
              <div
                className="w-full bg-gradient-to-t from-primary/60 to-primary/40 rounded-sm absolute bottom-0 hover:from-primary/80 hover:to-primary/60 transition-all duration-300 cursor-pointer"
                style={{ height: `${maxValue > 0 ? (day.active / maxValue) * 120 : 0}px` }}
                title={`${day.active} usuários ativos em ${day.date}`}
              />
              
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {day.active} ativos
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-400 block">{day.day}</span>
              <span className="text-xs text-white font-medium">{day.active}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Total de usuários: {users.data.length}</span>
          <span>Usuários ativos: {users.data.filter((u: any) => u.isActive).length}</span>
        </div>
      </div>
    </div>
  );
}