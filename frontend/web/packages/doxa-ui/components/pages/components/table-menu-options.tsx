import { promptYesOrNo } from '@/packages/doxa-ui/utils/helpers/sweetalert.helpers';
import ProtectedButton from '@/packages/mesquita-ui/components/protected-button';
import Button from '@/packages/doxa-ui/components/ui/button';
import { PencilIcon, Trash2Icon, XIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import uuid4 from 'uuid4';
import { BaseData, ListPageTableProps, TableItemMenuOption } from './list-page-table';
import { ListPageTemplateProps } from './list-page-template';

export type TableItemMenuOptionsProps<T> = {
  resource: string;
  onClickUpdate: ListPageTemplateProps<T>['onClickUpdate'];
  menuPosition: { top: boolean; left: boolean };
  item: T & BaseData;
  hoveredRow: T & BaseData;
  setSelectedItemToOpen: React.Dispatch<React.SetStateAction<T | null | undefined>>;
  selectedItemToOpen: (T & BaseData) | null | undefined;
  ref: any;
};

export default function TableMenuOptions<T>({
  resource,
  onClickUpdate,
  menuPosition,
  item,
  setSelectedItemToOpen,
  selectedItemToOpen,
  hoveredRow,
  tableItemMenuOptions,
  deleteData,
  onDeleteSuccess,
  ref,
  ...props
}: TableItemMenuOptionsProps<T> & Partial<ListPageTableProps<T>>) {
  const pathname = usePathname();

  return (
    <div
      key={uuid4()}
      className={twMerge(
        'card fixed right-[48px] bg-white p-1 rounded-md z-50 w-52 -mt-4 mr-1 [box-shadow:0px_0px_10px_#0002]',
        menuPosition?.top && 'bottom-[28px]'
      )}
      {...props}
    >
      <ProtectedButton
        resource={resource}
        action='Update'
        onNoPermission='hide'
        className='w-full bg-transparent hover:bg-zinc-100 text-zinc-700 justify-start border-none'
        {...(onClickUpdate === undefined && {
          href: `${pathname}/${item.id}/update`,
        })}
        {...(onClickUpdate && {
          onClick: (e) => {
            e.preventDefault();
            selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
              ? setSelectedItemToOpen(null)
              : setSelectedItemToOpen(item);

            onClickUpdate && onClickUpdate(e, item as T);
          },
        })}
      >
        <PencilIcon size={16} />
        <span>Editar</span>
      </ProtectedButton>

      {tableItemMenuOptions?.map(({ text, Icon, onClick, setHref, action, resource }) => (
        <ProtectedButton
          resource={resource}
          action={action}
          onNoPermission='hide'
          key={uuid4()}
          className='w-full bg-transparent border-none hover:bg-zinc-100 text-rd-700 justify-start '
          {...(setHref && { href: setHref(item) })}
          onClick={() => {
            onClick?.(item);
          }}
        >
          <Icon size={16} />
          <span>{text}</span>
        </ProtectedButton>
      ))}

      <ProtectedButton
        resource={resource}
        action={'Delete'}
        onNoPermission='hide'
        className='border-none w-full bg-transparent hover:bg-red-100 text-ed-700 justify-start w'
        onClick={() => {
          selectedItemToOpen?.id === item.id || hoveredRow?.id === item.id
            ? setSelectedItemToOpen(null)
            : setSelectedItemToOpen(item);
          promptYesOrNo(
            {
              title: 'Tem certeza que pretende deletar?',
            },
            () => {
              deleteData!(item.id).then((res) => onDeleteSuccess!(item as T));
            }
          );
        }}
      >
        <Trash2Icon size={16} />
        <span>Deletar</span>
      </ProtectedButton>

      <Button
        className='w-full bg-transparent hover:bg-zinc-100 text-rd-700 justify-start border-none'
        onClick={() => {
          setSelectedItemToOpen(null);
        }}
      >
        <XIcon size={16} />
        <span>Cancelar</span>
      </Button>
    </div>
  );
}
