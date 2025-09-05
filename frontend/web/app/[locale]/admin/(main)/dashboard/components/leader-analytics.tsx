import React from 'react';
import { Crown, Users, User, UserX } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LeaderMetrics {
  total: number;
  male: number;
  female: number;
  ageGroups: {
    young: number; 
    middle: number;
    senior: number; 
    veteran: number;  
  };
  genderPercentages: {
    male: string | number;
    female: string | number;
  };
}

interface LeadersAnalyticsProps {
  leaderMetrics: LeaderMetrics;
  className?: string;
}

const GenderCard = ({ type, count, percentage, total }: { 
  type: 'male' | 'female', 
  count: number, 
  percentage: string | number,
  total: number 
}) => {
  const isMale = type === 'male';
  
  return (
    <div className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isMale ? (
            <User className="w-4 h-4 text-blue-400" />
          ) : (
            <UserX className="w-4 h-4 text-pink-400" />
          )}
          <span className="text-sm text-gray-300">
            {isMale ? 'Homens' : 'Mulheres'}
          </span>
        </div>
        <span className="text-xs text-gray-500">{percentage}%</span>
      </div>
      
      <div className="text-xl font-semibold text-white mb-2">
        {count}
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isMale ? "bg-blue-500" : "bg-pink-500"
          )}
          style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
};

const AgeGroupCard = ({ label, count, ageRange, color }: {
  label: string;
  count: number;
  ageRange: string;
  color: string;
}) => (
  <div className="bg-gray-800/30 rounded-lg p-3 text-center hover:bg-gray-800/50 transition-colors">
    <div className={`text-lg font-bold mb-1 ${color}`}>
      {count}
    </div>
    <div className="text-xs text-gray-300 mb-1">{label}</div>
    <div className="text-xs text-gray-500">{ageRange}</div>
  </div>
);

export default function LeadersAnalytics({ leaderMetrics, className }: LeadersAnalyticsProps) {
  if (leaderMetrics.total === 0) {
    return (
      <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 ${className || ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Análise de Líderes</h3>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum líder identificado</p>
          </div>
        </div>
      </div>
    );
  }

  const { total, male, female, ageGroups, genderPercentages } = leaderMetrics;

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Análise de Líderes</h3>
        </div>
        <div className="text-sm text-gray-400">
          {total} líder{total !== 1 ? 'es' : ''} total
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-800/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {total}
          </div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        
        <div className="text-center p-3 bg-gray-800/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {male}
          </div>
          <div className="text-xs text-gray-400">Homens</div>
        </div>
        
        <div className="text-center p-3 bg-gray-800/20 rounded-lg">
          <div className="text-2xl font-bold text-pink-400 mb-1">
            {female}
          </div>
          <div className="text-xs text-gray-400">Mulheres</div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Distribuição por Gênero</h4>
        <div className="grid grid-cols-2 gap-4">
          <GenderCard 
            type="male" 
            count={male} 
            percentage={genderPercentages.male}
            total={total}
          />
          <GenderCard 
            type="female" 
            count={female} 
            percentage={genderPercentages.female}
            total={total}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3">Distribuição por Faixa Etária</h4>
        <div className="grid grid-cols-4 gap-3">
          <AgeGroupCard
            label="Jovens"
            count={ageGroups.young}
            ageRange="18-30"
            color="text-green-400"
          />
          <AgeGroupCard
            label="Adultos"
            count={ageGroups.middle}
            ageRange="31-45"
            color="text-blue-400"
          />
          <AgeGroupCard
            label="Seniores"
            count={ageGroups.senior}
            ageRange="46-60"
            color="text-orange-400"
          />
          <AgeGroupCard
            label="Veteranos"
            count={ageGroups.veteran}
            ageRange="60+"
            color="text-purple-400"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Insights</h4>
        <div className="space-y-2 text-xs text-gray-400">
          {male > 0 && female > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>
                Boa diversidade de gênero na liderança 
                ({Math.min(male, female)}/{Math.max(male, female)} proporção)
              </span>
            </div>
          )}
          
          {ageGroups.young > 0 && ageGroups.veteran > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Mix geracional saudável entre jovens e experientes</span>
            </div>
          )}
          
          {(male === 0 || female === 0) && total > 2 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <span>Considere aumentar diversidade de gênero na liderança</span>
            </div>
          )}
          
          {ageGroups.middle > total * 0.7 && (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              <span>Alta concentração na faixa etária 31-45 anos</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}