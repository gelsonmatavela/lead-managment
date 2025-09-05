import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function DashboardHeader({ 
  title = "Overview", 
  subtitle = "Today, 13 Aug",
  onMenuClick
}: DashboardHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <button 
          onClick={onMenuClick}
          className="p-1.5 hover:bg-gray-900 rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}