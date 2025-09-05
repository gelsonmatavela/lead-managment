import React from 'react';
import { cn } from '@/src/lib/utils';

interface Activity {
  event: string;
  time: string;
  type: 'user' | 'payment' | 'order' | 'upgrade';
}

interface ActivityFeedProps {
  activities: Activity[];
  todayCount?: number;
  totalCount?: number;
}

export default function ActivityFeed({ 
  activities, 
  todayCount = 24, 
  totalCount = 847 
}: ActivityFeedProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-white">Activity</h3>
        <span className="text-xs text-gray-500">Live</span>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              activity.type === 'user' && "bg-blue-400",
              activity.type === 'payment' && "bg-emerald-400",
              activity.type === 'order' && "bg-orange-400",
              activity.type === 'upgrade' && "bg-purple-400"
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">
                {activity.event}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {activity.time} ago
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mini stats at bottom */}
      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{todayCount}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{totalCount}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}