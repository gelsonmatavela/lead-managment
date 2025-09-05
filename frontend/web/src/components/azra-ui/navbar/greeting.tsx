import React from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { User } from '@/src/types/api';

interface GreetingProps {
  user: User;
  className?: string;
}

export default function Greeting({ user, className }: GreetingProps) {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: 'Bom dia',
        icon: Sunrise,
        color: 'text-orange-400'
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        greeting: 'Boa tarde',
        icon: Sun,
        color: 'text-yellow-400'
      };
    } else if (hour >= 18 && hour < 22) {
      return {
        greeting: 'Boa noite',
        icon: Sunset,
        color: 'text-orange-500'
      };
    } else {
      return {
        greeting: 'Boa madrugada',
        icon: Moon,
        color: 'text-blue-400'
      };
    }
  };

  const getDisplayName = (): string => {
    if (user.name) {
      return user.name.split(' ')[0]; // First name only
    }
    return user.email.split('@')[0]; // Username from email
  };

  const { greeting, icon: Icon, color } = getTimeOfDay();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm text-gray-300">
        {greeting}, <span className="font-medium text-white">{getDisplayName()}</span>
      </span>
    </div>
  );
}