import FilterBuilder from '@/packages/doxa-ui/components/ui/filter-builder/filter-builder';
import { Condition, FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';
import {
  buildPrismaFilterFromConditions,
  convertToSearchParams,
  parseQueryString,
  reverseEngineerConditions,
} from '@/packages/doxa-ui/components/ui/filter-builder/utils/filter-builder.helpers';
import Button from '@/packages/doxa-ui/components/ui/button';
import { ListFilterPlusIcon, ChevronDownIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { SetStateAction, useRef, useState } from 'react';
import { useUpdateSearchParams } from '../../../hooks/use-update-search-params';
import { useSetupFilters } from '../../../hooks/use-setup-filters';

export type FilterBuilderContainerProps = {
  availableFilteringFields: FilteringField[];
  queryParams: Record<string, any> | undefined;
  setQueryParams: React.Dispatch<SetStateAction<Record<string, any> | undefined>>;
  children: React.ReactNode;
};

export default function FilterBuilderContainer({
  availableFilteringFields,
  queryParams,
  setQueryParams,
  children,
}: FilterBuilderContainerProps) {
  const filtersBuilderRef = useRef<HTMLDivElement>(null);
  const filtersButtonRef = useRef<HTMLElement>(null);

  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const updateSearchParams = useUpdateSearchParams();

  const [conditions, setConditions] = useState<Condition[]>(
    reverseEngineerConditions(parseQueryString(searchParams.get('q')!), availableFilteringFields) ||
      []
  );

  useSetupFilters({
    filtersBuilderRef,
    filtersButtonRef,
    setConditions,
    queryParams,
    setQueryParams,
    showFilters,
    setShowFilters,
    availableFilteringFields,
  });

  const handleConditionsChange = (newConditions: Condition[] = []) => {
    setConditions(newConditions);
    if (newConditions.length === 0) updateSearchParams([{ name: 'q', value: '' }]);
    else {
      updateSearchParams([
        {
          name: 'q',
          value: convertToSearchParams(buildPrismaFilterFromConditions(newConditions) || []),
        },
      ]);
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='relative flex flex-col small-sm:justify-start items-end w-full h-fit bg-'>
        <div className='flex items-center ml-auto w-full justify-end  overflow-hidden gap-2'>
          <Button
            ref={filtersButtonRef}
            onClick={() => setShowFilters(!showFilters)}
            className='bg-background text-primary-500 border rounded-sm hover:bg-backgorund px-2 border-primary-400 h-[38px]'
          >
            <ListFilterPlusIcon size={18} />

            <div data-flipped={showFilters} className='ml- data-[flipped=true]:-rotate-180'>
              <ChevronDownIcon size={18} />
            </div>
          </Button>

          {children}
        </div>
        <div
          ref={filtersBuilderRef}
          data-hidden={!showFilters}
          className='fixed h-fit md:max-h-[70vh] max-h-[55vh] overflow-y-auto bg-background p-2 card rounded-md border-zinc-200 border mt-10 data-[hidden=true]:hidden z-[999]'
        >
          <FilterBuilder
            initialConditions={conditions}
            setQueryParams={setQueryParams}
            level={0}
            onConditionsChange={handleConditionsChange}
            filteringFields={availableFilteringFields}
          />
        </div>
      </div>
    </div>
  );
}
