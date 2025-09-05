// components/dashboard/LoadingStates.tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import useSidebar from '@/src/components/azra-ui/sidebar/hooks/use-sidebar-hooks';

export const LoadingDashboard = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={cn(
      "min-h-screen bg-black transition-all duration-300 ease-out",
      "pt-20 px-4 sm:px-6 pb-6",
      "ml-0 lg:ml-16",
      !isCollapsed && "lg:ml-72"
    )}>
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 sm:h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-700 rounded-full"></div>
              </div>
              <div className="h-6 sm:h-8 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Leaders analytics skeleton */}
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-32 sm:h-48 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                  <div className="h-4 bg-gray-700 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="h-3 bg-gray-700 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ErrorDashboard = ({ error, onRetry }: { error: any; onRetry?: () => void }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className={cn(
      "min-h-screen bg-black transition-all duration-300 ease-out",
      "pt-20 px-4 sm:px-6 pb-6",
      "ml-0 lg:ml-16",
      !isCollapsed && "lg:ml-72",
      "flex items-center justify-center"
    )}>
      <div className="text-center max-w-md w-full">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4 sm:mb-6" />
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
          Erro ao carregar dashboard
        </h2>
        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
          {error?.message || 'Ocorreu um erro inesperado ao carregar os dados do dashboard.'}
        </p>
        <div className="space-y-3">
          <button 
            onClick={onRetry || (() => window.location.reload())}
            className="w-full bg-primary hover:bg-primary/80 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-700 hover:bg-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium transition-colors text-sm sm:text-base"
          >
            Voltar
          </button>
        </div>
        
        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 sm:mt-6 text-left">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 p-3 bg-gray-900/50 rounded text-xs text-red-300 overflow-auto max-h-40">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export const MetricCardSkeleton = () => (
  <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg"></div>
        <div>
          <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      <div className="w-12 h-6 bg-gray-700 rounded-full"></div>
    </div>
    <div className="h-6 sm:h-8 bg-gray-700 rounded w-3/4"></div>
  </div>
);

export const ChartSkeleton = ({ className }: { className?: string }) => (
  <div className={cn(
    "bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 sm:p-6 animate-pulse",
    className
  )}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-5 bg-gray-700 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-700 rounded w-12"></div>
    </div>
    <div className="h-32 sm:h-48 bg-gray-700 rounded"></div>
  </div>
);

export const EmptyState = ({ 
  title, 
  description, 
  icon: Icon,
  action 
}: { 
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
}) => (
  <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-6 sm:p-8">
    <div className="text-center">
      {Icon && <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" />}
      <h3 className="text-base sm:text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{description}</p>
      {action}
    </div>
  </div>
);