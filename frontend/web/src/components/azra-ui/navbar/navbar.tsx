'use client'
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import useSidebar from '@/src/components/azra-ui/sidebar/hooks/use-sidebar-hooks';
import Greeting from './Greeting';
import { useRouter } from 'next/navigation';
import api from '@/src/utils/hooks/api.hooks';
import ProfileDropdown from './profile-dropdown';
import { User } from '@/src/types/api';
import LanguageSelector from '../../language-switcher/language-switcher';

interface NavbarProps {
  className?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export default function Navbar({ className }: NavbarProps) {
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  
  const { data: userResponse, isLoading } = api.auth.useGetMe<User>();

  const handleAccountClick = () => {
    router.push('/admin/account'); 
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleNotificationClick = () => {
    router.push('/admin/notifications');
  };

  if (isLoading) {
    return (
      <nav className={cn(
        "sticky top-0 z-40 bg-black backdrop-blur-xl border-b border-gray-800/50",
        "transition-all duration-300 ease-out",
        "ml-0 lg:ml-16",
        !isCollapsed && "lg:ml-72",
        className
      )}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const user = (userResponse as ApiResponse<User>)?.data;

  if (!user) {
    return null;
  }

  return (
    <nav className={cn(
      "sticky top-0 z-40 bg-black backdrop-blur-xl border-b border-gray-800/50",
      "transition-all duration-300 ease-out",
      "ml-0 lg:ml-16",
      !isCollapsed && "lg:ml-72",
      className
    )}
    style={{
      paddingTop: `max(0px, env(safe-area-inset-top, 0px))`,
    }}>
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Greeting user={user} className="hidden sm:flex" />
            
            <div className="sm:hidden">
              <span className="text-sm text-gray-300">
                Olá, <span className="font-medium text-white">
                  {user.name?.split(' ')[0] || 'Usuário'}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector/>
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-64 transition-all duration-200"
                />
              </div>
            </form>

            <button 
              onClick={() => router.push('/admin/search')}
              className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={handleNotificationClick}
              className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            <ProfileDropdown 
              user={user} 
              onAccountClick={handleAccountClick}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}