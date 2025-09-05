import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import api from '@/src/utils/hooks/api.hooks';
import { User } from '@/src/types/api';

interface ProfileDropdownProps {
  user: User;
  onAccountClick?: () => void;
}

export default function ProfileDropdown({ user, onAccountClick }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = api.auth.useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout.mutate();
    setIsOpen(false);
  };

  const handleAccountClick = () => {
    if (onAccountClick) {
      onAccountClick();
    }
    setIsOpen(false);
  };

  const getDisplayName = (): string => {
    return user.name || user.email;
  };

  const getInitials = (): string => {
    const name = getDisplayName();
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          {user.picture ? (
            <img
              src={user.picture}
              alt={getDisplayName()}
              className="w-8 h-8 rounded-full object-cover border border-gray-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {getInitials()}
              </span>
            </div>
          )}
          {/* Online indicator - só se estiver ativo */}
          {user.isActive && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-gray-950 rounded-full" />
          )}
        </div>

        {/* User info - hidden on small screens */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white truncate max-w-32">
            {getDisplayName()}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-32">
            {user.email}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User info header - visible on mobile */}
          <div className="sm:hidden p-4 border-b border-gray-800">
            <p className="text-sm font-medium text-white truncate">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
            {/* User status */}
            <div className="flex items-center gap-2 mt-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                user.isActive ? "bg-emerald-400" : "bg-gray-500"
              )} />
              <span className="text-xs text-gray-500">
                {user.isActive ? 'Ativo' : 'Inativo'}
              </span>
              {user.isStaff && (
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                  Staff
                </span>
              )}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button
              onClick={handleAccountClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              Conta
            </button>
            
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {logout.isPending ? 'Saindo...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}