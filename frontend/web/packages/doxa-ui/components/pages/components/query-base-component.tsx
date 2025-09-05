'use client';

import { ElementType, useEffect, useState } from 'react';
import {
  FrownIcon,
  MehIcon,
  RotateCcwIcon,
  ScanSearchIcon,
  CloudOffIcon,
  WifiOffIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import equal from 'deep-equal';
import PageLoadingSpinner from '@/packages/doxa-ui/components/ui/page-loading-spinner';
import LoadingSpinner from '@/packages/doxa-ui/components/ui/loading-spinner';

/**
 * Bouncing dots loading component with wave animation
 */
function BouncingDotsLoader({
  className = '',
  size = 'md',
  color = 'blue',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
}) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    blue: 'bg-primary-500',
    gray: 'bg-gray-500',
    white: 'bg-white',
  };

  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`;

  return (
    <div className={`flex items-center justify-center space-x-[3px] ${className}`}>
      <div
        className={dotClass}
        style={{ animationDelay: '0ms', animationDuration: '1000ms' }}
      ></div>
      <div
        className={dotClass}
        style={{ animationDelay: '160ms', animationDuration: '1000ms' }}
      ></div>
      <div
        className={dotClass}
        style={{ animationDelay: '320ms', animationDuration: '1000ms' }}
      ></div>
      <div
        className={dotClass}
        style={{ animationDelay: '480ms', animationDuration: '1000ms' }}
      ></div>
    </div>
  );
}
import Button from '@/packages/doxa-ui/components/ui/button';
import api from '@/src/utils/hooks/api.hooks';

/**
 * Standard response format for API data
 * @template T The type of data being returned
 */
export interface ApiDataResponse<T> {
  /** The actual data returned from the API */
  data: T;
  /** Optional total count of all available records */
  total?: number;
  /** Optional count of results in the current response */
  results?: number;
}

/**
 * Props passed to the success component
 * @template DataType The type of data being displayed
 * @template AdditionalProps Additional props specific to the success component
 */
export type SuccessComponentProps<
  DataType,
  AdditionalProps extends Record<string, any> = Record<string, any>
> = AdditionalProps & {
  /** Callback function triggered when the end of the content is reached */
  handleEndReached: () => void;
  /** Function to trigger a data refresh */
  triggerRefetch: () => void;
  /** The API response data */
  data: ApiDataResponse<DataType>;
  /** Whether data is currently being refreshed */
  isRefreshing: boolean;
};

/**
 * Configuration for error display
 */
interface ErrorDisplayConfig {
  /** Icon component to display */
  Icon: ElementType;
  /** Error message to show */
  message: string;
  /** Optional label for the retry button */
  buttonLabel?: string;
  /** The error object received from the API */
  error?: any;
  /** Error severity level */
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Props for the QueryBaseComponent
 * @template DataType The type of data being queried
 * @template PassedSuccessComponentProps Additional props for the success component
 */
interface QueryBaseComponentProps<DataType, PassedSuccessComponentProps> {
  /** Name of the resource to be fetched in camelCase and singular */
  name: string;
  /** Error message to display when data fetch fails */
  errorMessage?: string;
  /** Message to display when no resources exist */
  noResourcesMessage?: string;
  /** Message to display when no data is found */
  notFoundMessage?: string;
  /** Component to render when data is successfully loaded */
  SuccessComponent: ElementType;
  /** Component to render during loading state */
  LoadingComponent?: ElementType;
  /** The query key/name from the RTK Query API */
  query: 'useGetOne' | 'useGetMany';
  /** Parameters to pass to the query */
  params?: Record<string, any> | string | number;
  /** Whether to show the reload button */
  showReloadAgainButton?: boolean;
  /** Class name for the success component wrapper */
  successComponentWrapperClassName?: string;
  /** Additional props to pass to the success component */
  successComponentProps?: Partial<PassedSuccessComponentProps>;
  /** Whether to load more data when reaching the end */
  loadMoreOnEndReach?: boolean;
  /** Class name for the loading component */
  loadingComponentClassName?: string;
  /** Interval in milliseconds to automatically reload data */
  reloadAgainAfter?: number;
  /** Enable optimistic UI updates */
  enableOptimisticUI?: boolean;
  /** Custom empty state component */
  EmptyStateComponent?: ElementType;
  /** Show refresh indicator in success state */
  showRefreshIndicator?: boolean;
}

/**
 * A component that handles data fetching, loading states, pagination, and error handling
 * with improved UX patterns including optimistic updates, better error handling, and smooth transitions
 */
export default function QueryBaseComponent<DataType, PassedSuccessComponentProps>({
  name,
  errorMessage = 'Ocorreu um erro carregando o dado!',
  noResourcesMessage = 'Ainda não existe nenhum dado!',
  notFoundMessage = 'Não foi encontrado nenhum dado!',
  SuccessComponent,
  LoadingComponent = PageLoadingSpinner,
  query,
  params = {},
  showReloadAgainButton = true,
  successComponentWrapperClassName,
  successComponentProps,
  loadMoreOnEndReach = true,
  loadingComponentClassName,
  reloadAgainAfter = 0,
  enableOptimisticUI = true,
  EmptyStateComponent,
  showRefreshIndicator = true,
}: QueryBaseComponentProps<DataType, PassedSuccessComponentProps>) {
  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState<any>(params);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSuccessTime, setLastSuccessTime] = useState<Date | null>(null);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);

  const normalizedParams = typeof params === 'object' ? { page, ...params } : params;

  const { isLoading, isError, isSuccess, error, refetch, isFetching, data } = (api as any)[name][
    query
  ](queryParams);

  const handleRefetch = async () => {
    try {
      setRetryCount((prev) => prev + 1);
      await refetch();
      setRetryCount(0);
      setLastSuccessTime(new Date());

      if (showRefreshIndicator) {
        setShowSuccessIndicator(true);
        setTimeout(() => setShowSuccessIndicator(false), 2000);
      }
    } catch (err) {
      console.error('Refetch failed:', err);
    }
  };

  const handleEndReached = () => {
    const limit = (normalizedParams as Record<string, any>).limit || 30;
    const canLoadMore = data?.data && Array.isArray(data.data) && data.data.length % limit === 0;

    if (!isLoading && !isFetching && canLoadMore && loadMoreOnEndReach) {
      setPage((prev) => prev + 1);
      setIsLoadingMore(true);
    }
  };

  useEffect(() => {
    if (!isFetching && !isLoading && (isSuccess || isError)) {
      setIsRefetch(false);
      setIsLoadingMore(false);
    }
  }, [isFetching, isLoading, isSuccess, isError]);

  useEffect(() => {
    if (reloadAgainAfter > 0) {
      const interval = setInterval(handleRefetch, reloadAgainAfter);
      return () => clearInterval(interval);
    }
  }, [reloadAgainAfter]);

  useEffect(() => {
    if (!equal(normalizedParams, queryParams)) {
      setQueryParams(normalizedParams);
      setIsRefetch(true);
    }
  }, [normalizedParams]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      setLastSuccessTime(new Date());
    }
  }, [isSuccess, data]);

  if (isLoading || (isRefetch && isFetching && !enableOptimisticUI)) {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-4'>
        <BouncingDotsLoader size='lg' className='mb-2' />
        <p className='text-sm animate-pulse'>Carregando dados</p>
      </div>
    );
  }

  if (isError) {
    const getErrorConfig = (): ErrorDisplayConfig => {
      if (!error) {
        return {
          Icon: FrownIcon,
          message: errorMessage,
          severity: 'error',
        };
      }

      if (error.status === 'FETCH_ERROR' || !navigator.onLine) {
        return {
          Icon: WifiOffIcon,
          message: 'Sem conexão com a internet. Verifique sua conexão e tente novamente.',
          buttonLabel: 'Tentar Novamente',
          severity: 'warning',
        };
      }

      // Server errors
      if (error.status >= 500) {
        return {
          Icon: CloudOffIcon,
          message: 'Servidor temporariamente indisponível. Tente novamente em alguns instantes.',
          buttonLabel: 'Tentar Novamente',
          severity: 'error',
        };
      }

      // Client errors
      if (error.status === 404) {
        return {
          Icon: MehIcon,
          message: notFoundMessage,
          buttonLabel: 'Recarregar',
          severity: 'info',
        };
      }

      if (error.status === 403) {
        return {
          Icon: AlertTriangleIcon,
          message: 'Você não tem permissão para acessar este recurso.',
          severity: 'warning',
        };
      }

      // Rate limiting
      if (error.status === 429) {
        return {
          Icon: AlertTriangleIcon,
          message: 'Muitas tentativas. Aguarde alguns instantes antes de tentar novamente.',
          buttonLabel: 'Tentar Novamente',
          severity: 'warning',
        };
      }

      // Default error
      return {
        Icon: FrownIcon,
        message: errorMessage,
        severity: 'error',
      };
    };

    const errorConfig = getErrorConfig();

    return (
      <ErrorComponent
        {...errorConfig}
        triggerRefetch={handleRefetch}
        retryCount={retryCount}
        error={error}
      />
    );
  }

  if (isSuccess && data?.data) {
    const hasData = Array.isArray(data.data) ? data.data.length > 0 : true;

    if (hasData) {
      return (
        <div className='relative'>
          {showSuccessIndicator && (
            <div className='fixed top-4 right-4 z-50 bg-green-500 text-zinc-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300'>
              <CheckCircleIcon className='size-4' />
              <span className='text-sm'>Dados atualizados</span>
            </div>
          )}

          {/* Refresh indicator overlay */}
          {isFetching && enableOptimisticUI && (
            <div className='absolute top-0 left-0 right-0 z-10 bg-blue-500/10 h-1'>
              <div className='h-full bg-blue-500 animate-pulse'></div>
            </div>
          )}

          <div className={twMerge('', successComponentWrapperClassName)}>
            <SuccessComponent
              data={data}
              {...successComponentProps}
              handleEndReached={handleEndReached}
              triggerRefetch={handleRefetch}
              isRefreshing={isFetching}
            />
          </div>

          {/* Enhanced load more indicator */}
          {isLoadingMore && (
            <div className='flex flex-col items-center justify-center py-8 px-4'>
              <BouncingDotsLoader className='mb-3' />
              <span className='text-sm text-gray-600 animate-pulse'>Carregando mais dados...</span>
            </div>
          )}

          {/* Manual refresh button with better UX */}
          {showReloadAgainButton && Array.isArray(data.data) && (
            <div className='flex justify-center mt-6'>
              <Button
                variant='outline'
                onClick={handleRefetch}
                disabled={isFetching}
                className='group relative overflow-hidden transition-all hover:scale-105'
              >
                <RotateCcwIcon
                  className={twMerge(
                    'size-4 mr-2 transition-transform duration-300',
                    isFetching && 'animate-spin'
                  )}
                />
                {isFetching ? 'Atualizando...' : 'Atualizar'}

                {/* Subtle animation overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Enhanced empty state
    const EmptyComponent = EmptyStateComponent || DefaultEmptyState;
    return (
      <EmptyComponent
        message={noResourcesMessage}
        onRefresh={handleRefetch}
        isRefreshing={isFetching}
      />
    );
  }

  return null;
}

// /**
//  * Enhanced error component with better visual feedback and retry logic
//  */
// function ErrorComponent({
//   Icon,
//   message,
//   triggerRefetch,
//   buttonLabel = 'Tentar Novamente',
//   error,
//   retryCount = 0,
//   severity = 'error',
// }: ErrorDisplayConfig & {
//   triggerRefetch: () => void;
//   retryCount?: number;
//   severity?: 'error' | 'warning' | 'info';
// }) {
//   const getSeverityColors = () => {
//     switch (severity) {
//       case 'warning':
//         return {
//           bg: 'bg-amber-500',
//           border: 'border-amber-200',
//           button: 'destructive',
//         };
//       case 'info':
//         return {
//           bg: 'bg-blue-500',
//           border: 'border-blue-200',
//           button: 'default',
//         };
//       default:
//         return {
//           bg: 'bg-red-500',
//           border: 'border-red-200',
//           button: 'destructive',
//         };
//     }
//   };

//   const colors = getSeverityColors();

//   return (
//     <div className='w-full flex flex-col gap-4 flex-1 max-w-[400px] mx-auto animate-in fade-in-50 duration-300'>
//       <div className='flex-1 flex items-center justify-center flex-col rounded-lg overflow-hidden shadow-lg'>
//         <div
//           className={twMerge(
//             colors.bg,
//             'md:p-8 p-6 w-full items-center flex justify-center rounded-t-lg flex-col text-white gap-4'
//           )}
//         >
//           <div className='relative'>
//             <Icon strokeWidth={1.5} className='md:size-20 size-16 text-white' />
//             {retryCount > 0 && (
//               <div className='absolute -top-2 -right-2 bg-white text-gray-800 rounded-full size-6 flex items-center justify-center text-xs font-bold'>
//                 {retryCount}
//               </div>
//             )}
//           </div>
//           <div className='text-center space-y-2'>
//             <p className='text-lg font-medium'>{message}</p>
//             {retryCount > 2 && (
//               <p className='text-sm text-white/80'>
//                 Múltiplas tentativas falharam. Verifique sua conexão.
//               </p>
//             )}
//           </div>
//         </div>

//         <div
//           className={twMerge(
//             'rounded-b-lg border-2 border-t-0 w-full md:p-6 p-4 flex items-center justify-center flex-col gap-4 bg-white',
//             colors.border
//           )}
//         >
//           {error?.data?.message && (
//             <div className='bg-gray-50 p-3 rounded-md w-full'>
//               <p className='text-sm text-gray-700 text-center font-mono'>{error.data.message}</p>
//             </div>
//           )}

//           <Button
//             className='px-6 py-2 min-w-[140px] group relative overflow-hidden transition-all hover:scale-105'
//             variant={colors.button as any}
//             onClick={triggerRefetch}
//           >
//             <RotateCcwIcon className='size-4 mr-2 group-hover:rotate-180 transition-transform duration-300' />
//             {buttonLabel}

//             {/* Pulse effect for multiple retries */}
//             {retryCount > 0 && (
//               <div className='absolute inset-0 bg-white/20 animate-pulse rounded'></div>
//             )}
//           </Button>

//           {/* Connection status indicator */}
//           <div className='flex items-center gap-2 text-xs text-gray-500'>
//             <div
//               className={twMerge(
//                 'size-2 rounded-full',
//                 navigator.onLine ? 'bg-green-500' : 'bg-red-500'
//               )}
//             ></div>
//             <span>{navigator.onLine ? 'Online' : 'Offline'}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

/**
 * Enhanced error component with modern design, better visual feedback and retry logic
 */
function ErrorComponent({
  Icon,
  message,
  triggerRefetch,
  buttonLabel = 'Tentar Novamente',
  error,
  retryCount = 0,
  severity = 'error',
}: ErrorDisplayConfig & {
  triggerRefetch: () => void;
  retryCount?: number;
  severity?: 'error' | 'warning' | 'info';
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const getSeverityConfig = () => {
    switch (severity) {
      case 'warning':
        return {
          iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
          iconColor: 'text-amber-600',
          accentColor: 'border-amber-200',
          buttonVariant: 'default',
          glowColor: 'shadow-amber-500/20',
        };
      case 'info':
        return {
          iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
          iconColor: 'text-blue-600',
          accentColor: 'border-blue-200',
          buttonVariant: 'default',
          glowColor: 'shadow-blue-500/20',
        };
      default:
        return {
          iconBg: 'bg-gradient-to-br from-red-100 to-pink-100',
          iconColor: 'text-red-600',
          accentColor: 'border-red-200',
          buttonVariant: 'destructive',
          glowColor: 'shadow-red-500/20',
        };
    }
  };

  const config = getSeverityConfig();

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await triggerRefetch();
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  return (
    <div className='w-full flex flex-col items-center justify-center min-h-[300px] px-4 py-8'>
      <div className='max-w-md w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-500'>
        {/* Main Error Card */}
        <div
          className={twMerge(
            'relative bg-white rounded-2xl border-2 overflow-hidden',
            'shadow-xl backdrop-blur-sm',
            config.accentColor,
            config.glowColor
          )}
        >
          {/* Animated Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-transparent to-gray-900'></div>
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse'></div>
          </div>

          {/* Content */}
          <div className='relative p-8 text-center space-y-6'>
            {/* Icon with Animation */}
            <div className='relative mx-auto'>
              <div
                className={twMerge(
                  'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-1',
                  'transform transition-all duration-300 hover:scale-110',
                  config.iconBg
                )}
              >
                <Icon className={twMerge('w-10 h-10', config.iconColor)} strokeWidth={1.5} />

                {/* Retry count badge */}
                {retryCount > 0 && (
                  <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce'>
                    {retryCount}
                  </div>
                )}
              </div>

              {/* Pulsing ring animation */}
              <div
                className={twMerge(
                  'absolute inset-0 rounded-full border-2 opacity-20 animate-ping',
                  config.accentColor.replace('border-', 'border-')
                )}
              ></div>
            </div>

            {/* Error Message */}
            <div className='space-y-3'>
              <h3 className='text-xl font-semibold text-gray-900 leading-tight'>
                Oops! Algo deu errado
              </h3>
              <p className='text-gray-600 leading-relaxed text-sm'>{message}</p>

              {/* Multiple retry warning */}
              {retryCount > 2 && (
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-sm'>
                  <div className='flex items-center gap-2'>
                    <AlertTriangleIcon className='w-4 h-4 flex-shrink-0' />
                    <span>Múltiplas tentativas falharam. Verifique sua conexão.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Details (if available) */}
            {error?.data?.message && (
              <details className='text-left'>
                <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                  Detalhes técnicos
                </summary>
                <div className='mt-2 bg-gray-50 rounded-lg p-3 border'>
                  <code className='text-xs text-gray-700 font-mono break-all'>
                    {error.data.message}
                  </code>
                </div>
              </details>
            )}

            {/* Action Button */}
            <div className='pt-2'>
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                variant={config.buttonVariant as any}
                className={twMerge(
                  'px-8 py-2 font-medium transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  'shadow-lg hover:shadow-xl',
                  'group relative overflow-hidden mx-auto'
                )}
              >
                {/* Button content */}
                <span className='relative z-10 flex items-center gap-2'>
                  <RotateCcwIcon
                    className={twMerge(
                      'w-4 h-4 transition-transform duration-300',
                      isRetrying ? 'animate-spin' : 'group-hover:rotate-180'
                    )}
                  />
                  {isRetrying ? 'Tentando...' : buttonLabel}
                </span>

                {/* Button shine effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>

                {/* Retry pulse effect */}
                {retryCount > 0 && !isRetrying && (
                  <div className='absolute inset-0 bg-white/10 animate-pulse'></div>
                )}
              </Button>
            </div>

            {/* Connection Status */}
            <div className='flex items-center justify-center gap-2 text-xs text-gray-500 pt-2'>
              <div
                className={twMerge(
                  'w-2 h-2 rounded-full transition-colors',
                  navigator.onLine ? 'bg-green-500' : 'bg-red-500'
                )}
              ></div>
              <span>{navigator.onLine ? 'Conectado' : 'Sem conexão'}</span>
              {!navigator.onLine && (
                <span className='text-red-500 ml-1'>• Verifique sua internet</span>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>
          <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent'></div>
        </div>

        {/* Retry History (for debugging) */}
        {retryCount > 0 && process.env.NODE_ENV === 'development' && (
          <div className='mt-4 text-center'>
            <span className='text-xs text-gray-400'>
              Tentativas: {retryCount} • Última tentativa: {new Date().toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Default empty state component
 */
function DefaultEmptyState({
  message,
  onRefresh,
  isRefreshing,
}: {
  message: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-6 text-center max-w-md mx-auto'>
      <div className='relative mb-6'>
        <ScanSearchIcon className='size-16 text-gray-400 mb-4' strokeWidth={1} />
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl'></div>
      </div>

      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Nenhum dado encontrado</h3>
      <p className='text-gray-600 mb-6 text-sm leading-relaxed'>{message}</p>

      <Button
        variant='outline'
        onClick={onRefresh}
        disabled={isRefreshing}
        className='group relative overflow-hidden transition-all hover:scale-105'
      >
        <RotateCcwIcon
          className={twMerge(
            'size-4 mr-2 transition-transform duration-300',
            isRefreshing && 'animate-spin'
          )}
        />
        {isRefreshing ? 'Carregando...' : 'Carregar Dados'}

        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
      </Button>
    </div>
  );
}
