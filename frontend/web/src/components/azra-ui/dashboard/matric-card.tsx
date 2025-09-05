import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

export default function MetricCard({ label, value, change, trend }: MetricCardProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 hover:bg-gray-900/60 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-gray-400 font-medium">
          {label}
        </span>
        <div className={cn(
          "flex items-center gap-1",
          trend === 'up' ? 'text-emerald-400' : 'text-red-400'
        )}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span className="text-xs font-medium">
            {Math.abs(change)}%
          </span>
        </div>
      </div>
      <div className="text-2xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}