import React, { useMemo } from 'react';
import { Users, Shield, UserCheck } from 'lucide-react';

interface UserBreakdownProps {
  users: any;
  staff: any;
  className?: string;
}

export default function UserBreakdown({ users, staff, className }: UserBreakdownProps) {
  const breakdown = useMemo(() => {
    const userList = users?.data || [];
    const staffList = staff?.data || [];

    const active = userList.filter((u: any) => u.isActive).length;
    const inactive = userList.filter((u: any) => !u.isActive).length;
    const superUsers = userList.filter((u: any) => u.isSuperUser).length;
    const staffUsers = staffList.length;
    const regular = userList.length - superUsers - staffUsers;

    const total = userList.length;
    const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';
    const staffPercentage = total > 0 ? ((staffUsers / total) * 100).toFixed(1) : '0.0';
    const superUserPercentage = total > 0 ? ((superUsers / total) * 100).toFixed(1) : '0.0';

    return { 
      active, 
      inactive, 
      staffUsers, 
      superUsers, 
      regular,
      total,
      activePercentage: parseFloat(activePercentage),
      staffPercentage,
      superUserPercentage
    };
  }, [users, staff]);

  if (!users?.data?.length) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Usuários</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Nenhum usuário encontrado
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Usuários</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Ativos</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-white">{breakdown.active}</span>
            <span className="text-xs text-gray-400 ml-2">({breakdown.activePercentage}%)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Inativos</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-white">{breakdown.inactive}</span>
            <span className="text-xs text-gray-400 ml-2">
              ({((breakdown.inactive / breakdown.total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Por Função</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Super Usuários</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-white">{breakdown.superUsers}</span>
              <span className="text-xs text-gray-400 ml-2">({breakdown.superUserPercentage}%)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Staff</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-white">{breakdown.staffUsers}</span>
              <span className="text-xs text-gray-400 ml-2">({breakdown.staffPercentage}%)</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Usuários Regulares</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-white">{breakdown.regular}</span>
              <span className="text-xs text-gray-400 ml-2">
                ({((breakdown.regular / breakdown.total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="space-y-2">
          <div className="flex text-xs text-gray-400 justify-between mb-1">
            <span>Distribuição por status</span>
            <span>{breakdown.total} total</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 float-left"
              style={{ width: `${breakdown.activePercentage}%` }}
              title={`${breakdown.active} usuários ativos`}
            />
            <div 
              className="h-full bg-red-500 float-left"
              style={{ width: `${100 - breakdown.activePercentage}%` }}
              title={`${breakdown.inactive} usuários inativos`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}