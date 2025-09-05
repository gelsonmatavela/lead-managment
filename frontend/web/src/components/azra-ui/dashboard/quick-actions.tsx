import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface Action {
  label: string;
  description: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions: Action[];
  title?: string;
}

export default function QuickActions({ 
  actions, 
  title = "Quick Actions" 
}: QuickActionsProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
      <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      <div className="grid gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors text-left"
          >
            <div>
              <p className="text-sm text-white font-medium">{action.label}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}