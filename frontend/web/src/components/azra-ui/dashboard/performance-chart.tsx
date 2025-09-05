import React from 'react';
import { Dot } from 'lucide-react';

interface ChartData {
  month: string;
  value: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  label?: string;
}

export default function PerformanceChart({ 
  data, 
  title = "Performance", 
  subtitle = "Last 6 months",
  label = "Revenue"
}: PerformanceChartProps) {
  return (
    <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dot className="w-3 h-3 text-emerald-400" />
          <span className="text-xs text-gray-400">{label}</span>
        </div>
      </div>
      
      {/* Minimalist Bar Chart */}
      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-3">
            <div
              className="w-full bg-gradient-to-t from-emerald-500/60 to-emerald-400/40 rounded-sm hover:from-emerald-500/80 hover:to-emerald-400/60 transition-all duration-300 cursor-pointer"
              style={{ height: `${item.value}%` }}
            />
            <span className="text-xs text-gray-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}