'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/src/utils/hooks/api.hooks';
import { User } from '@/src/types/api';

interface UseSessionParams {
  area?: 'admin' | 'public';
  only?: string[];
  redirect?: boolean;
  unauthenticatedRedirectTo?: string;
}

export function useSession({
  area = 'admin',
  only = [],
  redirect = true,
  unauthenticatedRedirectTo = '/auth/login',
}: UseSessionParams = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const { data, isSuccess, isLoading, isError, error } = api.auth.useGetMe<User>();

  useEffect(() => {
    if (!data && !pathname.includes('/auth') && !isLoading && area === 'admin' && redirect) {
      router.push(`${unauthenticatedRedirectTo}?origin=${encodeURI(location.href)}`);
    }
    if (isSuccess && data.data && area === 'admin') {
      setAuthorized(only?.length > 0 ? only.includes(data.data.roles.toString()) : true);
    }
  }, [isLoading]);

  return { user: data?.data, isSuccess, isLoading, isError, error, authorized };
}
