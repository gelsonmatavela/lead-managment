// components/dashboard/CompanyOverview.tsx
import React, { useMemo } from 'react';
import { Building2, Users, Crown, Calendar } from 'lucide-react';

interface CompanyOverviewProps {
  companies: any;
  staff: any;
  className?: string;
}

export default function CompanyOverview({ companies, staff, className }: CompanyOverviewProps) {
  const companyStats = useMemo(() => {
    const companyList = companies?.data || [];
    const staffList = staff?.data || [];

    return companyList.map((company: any) => {
      // Find staff for this company
      const companyStaff = staffList.filter((s: any) => s.companyId === company.id);
      
      // Calculate leaders - fix the logic here
      // Since leaders are stored in the staff table with a relationship to company.leaders
      // We need to check if the staff record is in the company's leaders array
      const leaders = companyStaff.filter((s: any) => {
        // Check if this staff member is a leader in this company
        return company.leaders?.some((leader: any) => leader.userId === s.userId) || 
               company.leaders?.some((leader: any) => leader.id === s.id);
      });
      
      const daysActive = Math.floor(
        (new Date().getTime() - new Date(company.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...company,
        staffCount: companyStaff.length,
        leaderCount: leaders.length,
        daysActive,
        hasStaff: companyStaff.length > 0,
        efficiency: companyStaff.length > 0 ? ((leaders.length / companyStaff.length) * 100).toFixed(1) : '0'
      };
    }).sort((a: any, b: any) => b.staffCount - a.staffCount); 
  }, [companies, staff]);

  if (!companies?.data?.length) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Visão Geral das Empresas</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma empresa registrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Visão Geral das Empresas</h3>
        <div className="text-sm text-gray-400">
          {companyStats.length} empresa{companyStats.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Com Staff</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {companyStats.filter((c: any) => c.hasStaff).length}
          </div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Média Staff</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {companyStats.length > 0 ? 
              (companyStats.reduce((acc: number, c: any) => acc + c.staffCount, 0) / companyStats.length).toFixed(1) 
              : '0.0'
            }
          </div>
        </div>
      </div>
      
      {/* Company List */}
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {companyStats.map((company: any) => (
          <div 
            key={company.id} 
            className="border border-gray-800/30 rounded-lg p-4 hover:bg-gray-800/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {company.name}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {company.email}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {company.daysActive}d
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span className="text-gray-400">Staff:</span>
                <span className="text-white font-medium">{company.staffCount}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-400">Líderes:</span>
                <span className="text-white font-medium">{company.leaderCount}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Eficiência:</span>
                <span className="text-white font-medium">{company.efficiency}%</span>
              </div>
            </div>
            
            {/* Staff Progress Bar */}
            {company.staffCount > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Distribuição de papéis</span>
                  <span>{company.leaderCount}/{company.staffCount}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    style={{ 
                      width: `${company.staffCount > 0 ? (company.leaderCount / company.staffCount) * 100 : 0}%` 
                    }}
                    title={`${company.leaderCount} líderes de ${company.staffCount} staff`}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-semibold text-white">
              {staff?.data?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Total Staff</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {companyStats.reduce((acc: number, c: any) => acc + c.leaderCount, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Líderes</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {companyStats.filter((c: any) => c.daysActive < 30).length}
            </div>
            <div className="text-xs text-gray-400">Recentes</div>
          </div>
        </div>
      </div>
    </div>
  );
}