'use client';

import {
  ForwardRefExoticComponent,
  RefAttributes,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { camelCase, pascalCase } from 'change-case-all';
import { FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';
import TopButtonsContainer, { ButtonConfig } from './top-buttons-container';
import FilterBuilderContainer from './filter-builder-container';
import QueryBaseComponent from '@/packages/doxa-ui/components/pages/components/query-base-component';
import PageLoadingSpinner from '@/packages/doxa-ui/components/ui/page-loading-spinner';
import SelectWithCheckbBox from '@/packages/doxa-ui/components/ui/SelectWithCheckBox';
import { addTimestampsRecursively } from '../../ui/filter-builder/utils/filter-builder.helpers';
import { useSearchParams } from 'next/navigation';
import Button from '@/packages/doxa-ui/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, Columns3Icon, LucideProps } from 'lucide-react';
import { ListPageProps } from '../list-page';
import Input from '@/packages/doxa-ui/components/ui/input';
import PageTitleAndDescription from '../../../../doxa-ui/components/ui/page-title-and-description';
import ListPageTable, {
  BaseData,
  ListPageTableProps,
  TableItemMenuOption,
} from './list-page-table';
import { getGenericTableHeadersLabelsFromFilteringFields } from '@/packages/doxa-ui/utils/main.helpers';
import { useUpdateSearchParams } from '@/packages/doxa-ui/hooks/use-update-search-params';
import { singular } from 'pluralize';
import { FilterIcon } from 'lucide-react';
import api from '@/src/utils/hooks/api.hooks';
import Select from '../../../../doxa-ui/components/ui/select';
import { AppContext } from '@/src/utils/contexts/app.context';
import { twMerge } from 'tailwind-merge';

export type ListPageTemplateProps<T> = {
  title: string;
  name: string;
  description?: string;
  getQuery?: 'useGetOne' | 'useGetMany';
  params?: Record<string, any>;
  LoadingComponent?: React.ComponentType;
  ListRenderItem?: React.ComponentType;
  ListRenderItemContent?: React.ComponentType;
  ListComponent?: React.ComponentType<any>;
  listComponentProps?: Record<string, any>;
  queryComponentProps?: Record<string, any>;
  flatListClassName?: string;
  className?: string;
  itemIcon?: React.ReactNode;
  createScreen?: string;
  hideItem?: boolean;
  onClickUpdate?: (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>,
    item: T
  ) => void;
  onClickCreate?: (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => void;
  itemOptionsConfig?: Record<string, any>;
  topButtons?: React.ReactNode[] | ButtonConfig[];
  filteringFields?: FilteringField[];
  onDeleteSuccess?: (deleteItem: T) => void;
  cleanDataForTemplate?: (data: T) => Promise<Partial<T>>;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  tableItemMenuOptions?: TableItemMenuOption<T>[];
  mainContainerClassName?: string;
};

export default function ListPageTemplate<T>({
  title,
  name,
  LoadingComponent,
  params = {},
  description,
  getQuery,
  onClickUpdate,
  ListComponent,
  listComponentProps = {},
  queryComponentProps = {},
  topButtons,
  onClickCreate,
  filteringFields = [],
  onDeleteSuccess = (item) => {},
  cleanDataForTemplate = async (data) => data,
  tableItemMenuOptions,
  className,
  mainContainerClassName,
  Icon,
}: ListPageTemplateProps<T> & ListPageProps<T>) {
  const isFirstRender = useRef(false);

  useEffect(() => {
    isFirstRender.current = true;
  });

  const [queryParams, setQueryParams] = useState<Record<string, any> | undefined>({});

  const availableFilteringFields = useMemo<FilteringField[]>(
    () => addTimestampsRecursively(filteringFields),
    [filteringFields]
  );

  const [selectedItem, setSelectedItem] = useState<BaseData>({});

  const { mutateAsync: deleteData, ...deleteMutationResult } = api[singular(name)].useDeleteOne();

  const [selectedOptions, setSelectedOptions] = useState<any[]>(
    getGenericTableHeadersLabelsFromFilteringFields(availableFilteringFields)
      .filter((_: any, i: number) => i > 0)
      .map((label) => label)
  );

  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState<{
    total: number;
    data: Record<string, any>[];
    results: number;
  }>();
  let total = 1;
  if (responseData) ({ total } = responseData);

  const updateSearchParams = useUpdateSearchParams();

  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [filterName, setFilterName] = useState(
    searchParams.get('filterName') || filteringFields[0]?.label
  );
  const [limit, setLimit] = useState(Number(searchParams.get('limit') || 30));
  const [searchTerm, setSearchTerm] = useState<string | number>(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState<Record<string, any>>({});

  useEffect(() => {
    updateSearchParams([{ name: 'page', value: String(page) }]);
  }, [page]);

  useEffect(() => {
    updateSearchParams([{ name: 'limit', value: String(limit) }]);
  }, [limit]);

  const [triggerReloadAgain, setTriggerReloadAgain] = useState<() => void>();

  useEffect(() => {
    if (isFirstRender.current === false) setPage(1);
  }, [queryParams]);

  const filterField = useMemo(() => {
    const field = availableFilteringFields.find((field) => field.label === filterName)!;
    if (!field) {
      console.warn(`Campo com label "${filterName}" não encontrado.`);
      return { input: null, field: null };
    }
    const { type, inputType } = field;
    let input;
    let query = {};
    let getSearchValue = (value: string | number) => String(value).split(' ').join(' | ');

    let formatSearchQuery = (value: string | number) => {
      setSearchQuery({
        [field.prismaField]: {
          contains: String(value).split(' ').join(' | '),
          mode: 'insensitive',
        },
      });
    };

    switch (type) {
      case 'TEXT':
      case 'NUMBER':
        if (type === 'NUMBER')
          formatSearchQuery = (value: string | number) => {
            setSearchQuery({
              [field.prismaField]: Number(value),
            });
          };
      case 'DATE':
        if (type === 'DATE')
          formatSearchQuery = (value: string | number) => {
            const startDate = new Date(value);
            startDate.setDate(startDate.getDate() - 1);

            const endDate = new Date(value);
            endDate.setDate(endDate.getDate() + 1);

            setSearchQuery({
              [field.prismaField]: {
                lte: endDate.toISOString(),
                gte: startDate.toISOString(),
              },
            });
          };
        input = (
          <Input
            className='block w-full flex-1 max-w-80 bg-background'
            inputClassName='h-8 w-full'
            showSearchIcon={true}
            type={inputType}
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value!);
              if (!value) {
                updateSearchParams([{ name: 'search', value: '' }]);
                setPage(1);
              }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                updateSearchParams([
                  {
                    name: 'search',
                    value: getSearchValue(e.currentTarget.value),
                  },
                ]);
                formatSearchQuery(e.currentTarget.value);
                setPage(1);
              }
            }}
            placeholder={`Pesquisar por ${filterName}`}
          />
        );
        break;
    }

    return { input, field };
  }, [filterName, searchTerm]);

  const [csvData, setCsvData] = useState<Record<string, string | number | boolean>[]>([]);

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: 'set-page-title', payload: { title } });
  }, [title]);

  return (
    <>
      <div
        className={twMerge(
          ' lg:w-full sm:w-full w-full',
          className
        )}
      >
        <div className='flex items-center justify-between'>
          <div className='flex sm:flex-row flex-col justify-between gap-2 sm:items-center w-full'>
            <div className='flex items-center sm:gap-2 gap-1 flex-1'>
              <Select
                placeholder='Filtrar Por'
                className='hover:bg-background text-left  rounded-lg border '
                selectClassName='small-xl:w-[150px] sm:w-auto xs:w-[100px]  text-zinc-500 hover:bg-transparent p-0 py-1 px-0'
                selectContainerClassName='p-2 h-9 gap-2 '
                value={filterName}
                onChange={(value: string | number) => setFilterName(value as string)}
                options={getGenericTableHeadersLabelsFromFilteringFields(
                  availableFilteringFields
                ).map((label) => ({ value: label, label }))}
                valueSpanClassName='small-xl:inline hidden'
              >
                <FilterIcon className='text-zinc-700' size={18} />
              </Select>
              <div className='small-sm:w-64 w-96'>{filterField.input}</div>
            </div>

            <FilterBuilderContainer
              availableFilteringFields={availableFilteringFields}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
            >
              <div className='w-auto h-fit'>
                <SelectWithCheckbBox
                  placeholder={
                    <div className='flex items-center gap-0 px-1 mr-2'>
                      <Columns3Icon size={18} />
                    </div>
                  }
                  className=' h-[37px]'
                  selectContainerClassName='rounded-sm p-[2px] border- px-0 bg-blue-100 text-blue-700 border border-blue-400  '
                  selectedOptions={selectedOptions}
                  setSelectedOptions={(opts) => {
                    setSelectedOptions(opts);
                  }}
                  options={getGenericTableHeadersLabelsFromFilteringFields(availableFilteringFields)
                    .filter((_: any, i: number) => i > 0)
                    .map((label) => ({ value: label, label }))}
                />
              </div>
              <TopButtonsContainer
                topButtons={topButtons}
                onClickCreate={onClickCreate}
                onClickUpdate={onClickUpdate}
                deleteData={deleteData}
                csvData={csvData.map((data, i) => {
                  return { 'N°': `${i + 1}`, ...data };
                })}
                selectedItem={selectedItem}
                onDeleteSuccess={onDeleteSuccess}
                cleanDataForTemplate={cleanDataForTemplate}
                name={name}
              />
            </FilterBuilderContainer>
          </div>
        </div>

        <div
          className={twMerge(
            'main-container bg-transparent border-none overflow-hidden ',
            mainContainerClassName
          )}
        >
          <div className='min-h-[calc(100vh/2)] flex flex-col overflow-y-auto rounded-md md:h-full h-[calc(100vh-240px)] -mt-2 -mx-2 '>
            <QueryBaseComponent<T[], ListPageTableProps<T> & Partial<ListPageTemplateProps<T>>>
              name={camelCase(name)}
              successComponentWrapperClassName='h-full w-full'
              {...queryComponentProps}
              successComponentProps={{
                ...listComponentProps,
                name,
                onClickUpdate,
                selectedItem,
                setSelectedItem,
                filteringFields: availableFilteringFields,
                deleteMutationResult,
                selectedOptions,
                setResponseData,
                setTriggerReloadAgain,
                onClickCreate,
                onDeleteSuccess,
                csvData,
                setCsvData,
                cleanDataForTemplate,
                deleteData,
                tableItemMenuOptions,
              }}
              SuccessComponent={ListComponent || ListPageTable<T & BaseData>}
              notFoundMessage={`Não foi encontrando nenhuma lista!`}
              noResourcesMessage={`Não foi encontrando nenhum dado`}
              errorMessage='Ocorreu um erro carregando a lista!'
              showReloadAgainButton={false}
              LoadingComponent={LoadingComponent || TableShimmer || PageLoadingSpinner}
              query={getQuery || 'useGetMany'}
              params={{
                limit,
                page,
                ...(searchParams.get('search') && searchQuery),
                ...params,
                ...(Object.keys(queryParams || {}).length > 0 && {
                  ...queryParams,
                  filterMode: 'AND',
                }),
              }}
            />
          </div>
          <div className='pt-1 flex w-full justify-end mb-1 mt-auto'>
            {responseData && (
              <div className='flex items-center small:justify-end justify-between gap-2 mr-4 '>
                <p className='small-sm:block hidden'>Linhas por página</p>{' '}
                <Select
                  value={limit}
                  onChange={setLimit as (value: number | string) => void}
                  options={[
                    { label: '30', value: 30 },
                    ...((total >= 50 && [{ label: '50', value: 50 }]) || []),
                    ...((total >= 100 && [{ label: '100', value: 100 }]) || []),
                    ...((total >= 200 && [{ label: '200', value: 200 }]) || []),
                    { label: 'Todos', value: Math.max(total, 1000) },
                  ]}
                  className='sm:mr-4 mr-2 w-fit'
                />
                <div>
                  {limit * page - limit + 1} - {limit * page >= total ? total : limit * page} de{' '}
                  {total}
                </div>
                <div className='flex gap-1 items-center'>
                  <Button
                    variant='flat'
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className='px-0 aspect-square'
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <div className='aspect-square w-4 flex items-center justify-center'>{page}</div>
                  <Button
                    variant='flat'
                    disabled={limit * page >= total}
                    onClick={() => setPage(page + 1)}
                    className='px-0 aspect-square'
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const TableShimmer = () => {
  return (
    <div className='w-full animate-pulse mt-2 border rounded-md overflow-hidden'>
      <div className='flex items-center border-b border-gray-200 py-3 border-t px-3'>
        <div className='w-10 h-5 flex-shrink-0 '>
          <div className='w-4 h-4 bg-background rounded'></div>
        </div>
        <div className=' h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='h-5 bg-background rounded flex-shrink-0 mr-4 w-[440px]'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
        <div className='w-32 h-5 bg-background rounded flex-shrink-0'></div>
      </div>

      {[...Array(10)].map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className='flex items-center py-3 border-b border-gray-200 px-3'
        >
          <div className='w-10 h-5 flex-shrink-0 mr-4'>
            <div className='w-4 h-4 bg-background rounded'></div>
          </div>
          <div className='h-5 bg-background rounded flex-shrink-0 mr-4 w-[440px]'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-28 h-5 bg-background rounded flex-shrink-0 mr-4'></div>
          <div className='w-32 h-5 bg-background rounded flex-shrink-0'></div>
        </div>
      ))}
    </div>
  );
};