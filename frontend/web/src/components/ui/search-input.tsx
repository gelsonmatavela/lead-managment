'use client';

import { useUpdateSearchParams } from '@/packages/doxa-ui/hooks/use-update-search-params';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Input from '../../../packages/doxa-ui/components/ui/input';

export default function SearchInput({
  searchMode = 'passed-state',
  searchParamName = 'search',
  ...props
}: {
  searchMode?: 'search-params-on-enter' | 'passed-state' | 'search-params-on-change';
  searchParamName?: string;
} & React.ComponentProps<typeof Input>) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get(searchParamName) || '');

  const updateSearchParams = useUpdateSearchParams();

  return (
    <Input
      type='search'
      {...props}
      value={props.value || searchTerm}
      onChange={
        props.onChange ||
        ((value) => {
          setSearchTerm(value as string);
          if (searchMode === 'search-params-on-change' && value)
            updateSearchParams([{ name: searchParamName, value: value as string }]);

          if (!value) {
            updateSearchParams([{ name: searchParamName, value: '' }]);
          }
        })
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          updateSearchParams([
            {
              name: searchParamName,
              value: e.currentTarget.value.split(' ').join(' | '),
            },
          ]);
        }
      }}
    />
  );
}
