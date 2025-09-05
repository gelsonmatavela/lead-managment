'use client';

import React, { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';
import ListPageTemplate, { ListPageTemplateProps } from './components/list-page-template';
import { LucideProps } from 'lucide-react';

export type ListPageProps<T> = {
  /** Name of the tag the queried in camelCase and singular. */
  name?: string;
  title?: string;
  description?: string;
  CreateDataModal?: React.ElementType;
  UpdateDataModal?: React.ElementType;
  filteringFields: FilteringField[];
  params?: Record<string, any>;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};

export default function ListPage<T extends { id: string }>({
  name,
  title,
  description,
  CreateDataModal,
  UpdateDataModal,
  filteringFields,
  onDeleteSuccess = (item: any) => {},
  cleanDataForTemplate,
  params = {},
  Icon,
  ...props
}: ListPageProps<T> & ListPageTemplateProps<T>) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState('');

  return (
    <>
      <ListPageTemplate
        name={name}
        title={title}
        Icon={Icon}
        description={description}
        filteringFields={filteringFields}
        onDeleteSuccess={onDeleteSuccess}
        cleanDataForTemplate={cleanDataForTemplate}
        params={params}
        {...(UpdateDataModal && {
          onClickUpdate: (
            e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>,
            data: Partial<T>
          ) => {
            e.preventDefault();
            setUpdateModalIsOpen(true);
            setIdToUpdate(data.id!);
          },
        })}
        {...(CreateDataModal && {
          onClickCreate: (
            e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
          ) => {
            e.preventDefault();
            setModalIsOpen(true);
          },
        })}
        {...props}
      />
      {CreateDataModal && <CreateDataModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />}
      {UpdateDataModal && (
        <UpdateDataModal
          id={idToUpdate}
          isOpen={updateModalIsOpen}
          setIsOpen={setUpdateModalIsOpen}
        />
      )}
    </>
  );
}
