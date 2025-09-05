import React from 'react';
import { Activity, Clock, User, Shield, UserCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ActivityItem {
  id: string;
  name: string;
  email: string;
  action: string;
  timestamp: string;
  userType: 'superuser' | 'staff' | 'regular';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}

const getUserTypeIcon = (type: string) => {
  switch (type) {
    case 'superuser':
      return Shield;
    case 'staff':
      return UserCheck;
    default:
      return User;
  }
};

const getUserTypeColor = (type: string) => {
  switch (type) {
    case 'superuser':
      return 'text-red-400';
    case 'staff':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
};

const getUserTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'superuser':
      return 'bg-red-900/30 text-red-300';
    case 'staff':
      return 'bg-blue-900/30 text-blue-300';
    default:
      return 'bg-gray-900/30 text-gray-300';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return date.toLocaleDateString('pt-PT');
};

export default function RecentActivity({ activities, className }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        </div>
      </div>
    );
  }

  const todayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  }).length;

  return (
    <div className={`bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Ao vivo</span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = getUserTypeIcon(activity.userType);
          
          return (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-800/30 rounded-lg transition-colors">
              <div className={cn(
                "p-2 rounded-full",
                activity.userType === 'superuser' && "bg-red-900/30",
                activity.userType === 'staff' && "bg-blue-900/30",
                activity.userType === 'regular' && "bg-gray-900/30"
              )}>
                <IconComponent className={cn("w-4 h-4", getUserTypeColor(activity.userType))} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-white font-medium truncate">
                    {activity.name}
                  </p>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    getUserTypeBadgeColor(activity.userType)
                  )}>
                    {activity.userType === 'superuser' ? 'Admin' : 
                     activity.userType === 'staff' ? 'Staff' : 'User'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {activity.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.action}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{todayActivities}</div>
            <div className="text-xs text-gray-400">Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{activities.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}