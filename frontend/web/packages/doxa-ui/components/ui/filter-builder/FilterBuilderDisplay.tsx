import React from 'react';
import { filterTypes } from './utils/filter-builder.helpers';
import { Condition, FilterType } from './types';
import { XIcon } from 'lucide-react';

const getSymbolicOperator = (fieldType, operator) => {
  const filterType = filterTypes[fieldType];
  return filterType.prismaMapping[operator]?.[1] || operator;
};

export const getHumanReadableOperator = (
  type: FilterType,
  prismaOperator: string
): string | null => {
  const filterType = filterTypes[type];

  if (!filterType) return null;
  const { prismaMapping } = filterType;

  for (const [humanReadable, mapping] of Object.entries(prismaMapping)) {
    if (mapping.includes(prismaOperator)) return humanReadable;
  }
  return null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return '';
  }
};

const formatValue = (value, type) => {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (type === 'DATE') {
    return formatDate(value);
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (type === 'NUMBER' && value.split(',').length < 2) return Number(value);

  return value.toString();
};

const consolidateBetweenConditions = (conditions: Condition[]) => {
  const betweenPairs: Record<any, any> = {};
  const otherConditions: Partial<Condition>[] = [];

  conditions.forEach((condition) => {
    const { field, operator, value } = condition;

    // If we find a gte or lte operator, it might be part of a between
    // FIXME: was just field as index
    if (operator === 'gte' || operator === 'lte') {
      if (!betweenPairs[field.name]) {
        betweenPairs[field.name] = {};
      }
      betweenPairs[field.name][operator] = value;
    } else {
      otherConditions.push(condition);
    }
  });

  // Convert pairs to between conditions
  Object.entries(betweenPairs).forEach(([field, values]) => {
    if (values.gte !== undefined && values.lte !== undefined) {
      otherConditions.push({
        field,
        operator: 'between',
        value: `${values.gte},${values.lte}`,
      });
    } else {
      // If we don't have both gte and lte, add them as individual conditions
      if (values.gte !== undefined) {
        otherConditions.push({ field, operator: 'gte', value: values.gte });
      }
      if (values.lte !== undefined) {
        otherConditions.push({ field, operator: 'lte', value: values.lte });
      }
    }
  });

  return otherConditions;
};

const parseRelationConditions = (value, condition: Condition) => {
  if (!value || typeof value !== 'object') return [];
  const conditions = [];
  Object.entries(value).forEach(([key, val]) => {
    if (key === 'AND' && Array.isArray(val)) {
      // Extract all conditions from AND array
      const andConditions = val.map((andCond) => {
        const [operator, value] = Object.entries(andCond)[0];
        return {
          field: key,
          operator: operator,
          value: value,
        };
      });
      // Consolidate any between conditions before adding
      conditions.push(...consolidateBetweenConditions(andConditions));
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      if (Object.keys(val)[0] === 'AND') {
        // Handle nested AND conditions
        const andConditions = val.AND.map((andCond) => {
          const [operator, value] = Object.entries(andCond)[0];
          return {
            field: key,
            operator: operator,
            value: value,
          };
        });
        conditions.push(...consolidateBetweenConditions(andConditions));
      } else {
        const innerOperator = Object.keys(val)[0];
        let mathOperator = innerOperator;
        Object.keys(filterTypes).find((filterTypeKey: string) => {
          const prismaMapping = filterTypes[filterTypeKey as FilterType].prismaMapping;
          Object.keys(prismaMapping).forEach((prismaMappingKey: string) => {
            if (prismaMapping[prismaMappingKey].includes(innerOperator))
              mathOperator = prismaMapping[prismaMappingKey][1];
          });

          return mathOperator;
        });
        conditions.push({
          field: condition.field.relationFilteringFields?.find(
            (field) => field.name === `${condition.field.name}__${key}`
          )?.label,
          operator: mathOperator,
          value: val[innerOperator],
        });
      }
    }
  });
  return conditions;
};

const FilterDisplay = ({ conditions }: { conditions: Condition[] }) => {
  if (conditions.length === 0 || !conditions) {
    return <div className='text-gray-500'>Nenhum filtro aplicado.</div>;
  }

  const renderCondition = (condition: Condition) => {
    const { field, operator, value } = condition;

    if (field.type === 'RELATION') {
      const nestedConditions = parseRelationConditions(value, condition);
      return (
        <div className='space-y-2 flex items-center border rounded-md bg-zinc-200  px-2 py-[2px] '>
          {nestedConditions.map((nestedCond, idx) => (
            <div key={idx} className='flex items-center gap-1 px-2 py-[2px] rounded-lg text-sm'>
              <span className='text-primary-500 font-bold mx-1 '>{operator}</span>
              <span className='font-medium'>{field.label}</span>
              <span className='text-primary-500 font-bold mx-1'> que </span>
              <span className='font-medium'>{nestedCond.field}</span>
              <span className='text-primary-500 font-bold mx-1'>
                {getHumanReadableOperator('TEXT', nestedCond.operator)}
              </span>
              {nestedCond.operator === 'entre' ? (
                <span>
                  {formatValue(nestedCond.value, field.type)}{' '}
                  <span className='text-primary-500 font-bold'>e </span>
                  {formatValue(nestedCond.value, field.type)}
                </span>
              ) : (
                <span>"{formatValue(nestedCond.value, field.type)}"</span>
              )}
            </div>
          ))}

          <button className=' ml-4'>
            <XIcon size={14} strokeWidth={3} />
          </button>
        </div>
      );
    }

    return (
      <div className='flex items-center gap-1 px-2 py-[2px]  border rounded-md bg-zinc-200'>
        <span className='font-medium'>{field.label}</span>
        <span className='text-primary-500 font-bold mx-1'>{operator}</span>
        {operator === 'entre' ? (
          <span>
            {formatValue(value.split(',')[0], field.type)}{' '}
            <span className='text-primary-500 font-bold'>e </span>
            {formatValue(value.split(',')[1], field.type)}
          </span>
        ) : (
          <span>
            {typeof formatValue(value, field.type) === 'number'
              ? formatValue(value, field.type)
              : `"${formatValue(value, field.type)}"`}
          </span>
        )}

        <button className=' ml-4'>
          <XIcon size={14} strokeWidth={3} />
        </button>
      </div>
    );
  };

  return (
    <div className='space-y-2 flex gap-2'>
      {conditions.map((condition, index) => (
        <div key={condition.id || index}>{renderCondition(condition)}</div>
      ))}
    </div>
  );
};

export default FilterDisplay;
