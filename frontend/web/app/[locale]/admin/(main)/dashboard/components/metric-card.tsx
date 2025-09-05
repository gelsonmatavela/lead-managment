import React from 'react';
import { TrendingUp, LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  description?: string;
  className?: string;
}

export default function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend, 
  description,
  className 
}: MetricCardProps) {
  return (
    <div className={cn(
      "bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 hover:bg-gray-900/60 transition-all duration-200",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-sm text-gray-400 font-medium">{label}</span>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trend === 'up' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'
          )}>
            <TrendingUp className={cn("w-3 h-3", trend === 'down' && "rotate-180")} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-white mb-1">
        {value}
      </div>
    </div>
  );
}