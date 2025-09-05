import React from 'react';
import { twMerge } from 'tailwind-merge';
import { FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';
import { BaseData } from './list-page-table';
import { CheckIcon, XIcon } from 'lucide-react';

export default function FilteringFieldsTableData({
  className,
  availableFields,
  field,
  item,
  renderItem = (value) => <>{value}</>,
  selectedOptions,
  index,
  getColumnWidth,
  ...props
}: {
  children?: React.ReactNode;
  availableFields: FilteringField[];
  field: FilteringField;
  item: BaseData;
  renderItem?: (value: string) => React.JSX.Element;
  selectedOptions: any[];
  index: number;
  getColumnWidth: (columnKey: string) => number;
} & React.HTMLAttributes<HTMLDivElement>) {
  let value = item[field.prismaField];
  const fieldRelationFields =
    typeof field?.relationFilteringFields === 'function'
      ? field?.relationFilteringFields()
      : field?.relationFilteringFields;

  if (field.type === 'DATE' && value) value = new Date(value).toUTCString();
  if (field.type === 'RELATION') {
    if (field.relationType?.endsWith('ToOne')) {
      const fieldItem = JSON.parse(JSON.stringify(value || '{}'));

      const relationLabelAndFieldValues: { label: string; value: string; field: FilteringField }[] =
        [];

      for (let j = 0; j < fieldRelationFields!.length; j++) {
        value = fieldItem?.[fieldRelationFields![j]?.prismaField];
        const nestedLabel = `${field.label} (${fieldRelationFields![j].label})`;
        if (
          fieldRelationFields![j].type === 'DATE' &&
          fieldItem?.[fieldRelationFields![j]?.prismaField]
        )
          value = new Date(value).toUTCString();
        if (selectedOptions.includes(nestedLabel)) {
          relationLabelAndFieldValues.push({
            value,
            label: nestedLabel,
            field: fieldRelationFields![j],
          });
        }
      }

      return relationLabelAndFieldValues.map(({ value: rfValue, label, field: nestedField }, i) => {
        return (
          <TableDataContent
            key={i}
            className={className}
            data-test={field.prismaField}
            hasDataTransformer={!!nestedField.configs?.dataTransformer}
            style={{ width: `${getColumnWidth(label)}px` }}
          >
            {nestedField.configs?.dataTransformer
              ? renderItem(nestedField.configs.dataTransformer(item[field.prismaField]))
              : renderItem(rfValue !== null && rfValue !== undefined ? String(rfValue) : '-')}
          </TableDataContent>
        );
      });
    } else {
      value = (value as [])?.length;
    }
  }
  if ((selectedOptions.includes(`${field.label}`) && availableFields[0].label) || index === 0) {
    if (typeof value === 'boolean') {
      if (value) value = <CheckIcon className='text-green-500' />;
      else value = <XIcon className='text-red-500' />;
    } else {
      value = value !== null && value !== undefined ? String(value) : '-';
    }

    return (
      <TableDataContent
        key={field.label}
        hasDataTransformer={!!field.configs?.dataTransformer}
        className={className}
        data-test={field.prismaField}
        style={{ width: `${getColumnWidth(field.label)}px` }}
        // {...props}
      >
        {field.configs?.dataTransformer
          ? renderItem(field.configs?.dataTransformer(item))
          : renderItem(value)}
      </TableDataContent>
    );
  }
}

function TableDataContent({
  children,
  className,
  hasDataTransformer,
  ...props
}: {
  children: React.ReactNode;
  hasDataTransformer: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        data-has-transformer={hasDataTransformer}
        className={twMerge(
          'text-left border-r w-40 p-2 data-[has-transformer=true]:py-0 truncate flex-shrink-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}
