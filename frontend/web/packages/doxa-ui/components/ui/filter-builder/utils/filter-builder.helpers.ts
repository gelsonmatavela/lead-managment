import { Condition, FilteringField, FilteringFieldFunction, FilterType } from '../types';

export type FilterTypes = Record<
  FilterType,
  {
    operators: string[];
    component: string;
    type?: string;
    options?: string[];
    prismaMapping: { [x: string]: string[] };
  }
>;

export const filterTypes: FilterTypes = {
  TEXT: {
    operators: ['contém', 'igual á', 'diferente de', 'começa com', 'termina com'],
    component: 'input',
    type: 'text',
    prismaMapping: {
      ['contém']: ['contains', '*='],
      'igual á': ['equals', '='],
      'diferente de': ['not', '!='],
      'começa com': ['startsWith', '^='],
      'termina com': ['endsWith', '$='],
    },
  },
  NUMBER: {
    operators: [
      'igual á',
      'diferente de',
      'maior que',
      'maior ou igual á',
      'menor que',
      'menor ou igual á',
      'entre',
    ],
    component: 'input',
    type: 'number',
    prismaMapping: {
      'igual á': ['equals', '='],
      'diferente de': ['not', '!='],
      'maior que': ['gt', '>'],
      'maior ou igual á': ['gte', '>='],
      'menor que': ['lt', '<'],
      'menor ou igual á': ['lte', '<='],
      entre: ['between', '...'],
    },
  },
  DATE: {
    operators: ['igual á', 'diferente de', 'antes de', 'depois de', 'entre'],
    component: 'input',
    type: 'datetime-local',
    prismaMapping: {
      'igual á': ['equals', '='],
      'diferente de': ['not', '!='],
      'antes de': ['lt', '<'],
      'depois de': ['gt', '>'],
      entre: ['between', '...'],
    },
  },
  SELECT: {
    operators: ['igual á', 'não está em', 'está em'],
    component: 'select',
    prismaMapping: {
      'igual á': ['equals', '='],
      'não está em': ['notIn', '!='],
      'está em': ['in', '∈'],
    },
  },
  MULTISELECT: {
    operators: ['está em', 'não está em'],
    component: 'multi-select',
    prismaMapping: {
      'está em': ['in', '∈'],
      'não está em': ['notIn', '∉'],
    },
  },
  BOOLEAN: {
    operators: ['igual á'],
    component: 'checkbox',
    prismaMapping: {
      'igual á': ['equals', '='],
    },
  },
  RELATION: {
    operators: ['algum', 'nenhum', 'todos', 'tem'],
    component: 'relation-picker',
    prismaMapping: {
      algum: ['some', '∃'],
      nenhum: ['none', '∄'],
      todos: ['every', '∀'],
      tem: ['is', '∈'],
    },
  },
};

type IncompatibleOperators = {
  [K in FilterType]?: {
    [operator: string]: string[];
  };
};

export const incompatibleOperators: IncompatibleOperators = {
  TEXT: {
    contém: ['igual á', 'contém'],
    'igual á': ['contém', 'começa com', 'termina com', 'diferente de', 'igual á'],
    'diferente de': ['igual á', 'diferente de'],
    'começa com': ['igual á', 'começa com'],
    'termina com': ['igual á', 'termina com'],
  },
  NUMBER: {
    'igual á': [
      'diferente de',
      'maior que',
      'menor que',
      'maior ou igual á',
      'menor ou igual á',
      'entre',
      'igual á',
      'entre',
    ],
    'diferente de': ['igual á', 'diferente de'],
    'maior que': ['igual á', 'maior que', 'maior ou igual á', 'entre'],
    'maior ou igual á': ['igual á', 'maior que', 'maior ou igual á', 'entre'],
    'menor que': ['igual á', 'menor que', 'menor ou igual á', 'entre'],
    'menor ou igual á': ['igual á', 'menor ou igual á', 'menor que', 'entre'],
    entre: ['igual á', 'entre', 'maior que', 'maior ou igual á', 'menor que', 'menor ou igual á'],
  },
  DATE: {
    'igual á': ['diferente de', 'antes de', 'depois de', 'entre', 'igual á'],
    'diferente de': ['igual á', 'diferente de'],
    'antes de': ['igual á', 'antes de', 'entre'],
    'depois de': ['igual á', 'depois de', 'entre'],
    entre: ['igual á', 'entre', 'antes de', 'depois de'],
  },
  SELECT: {
    'igual á': ['não está em', 'está em', 'igual á'],
    'não está em': ['igual á', 'está em', 'não está em'],
    'está em': ['igual á', 'não está em', 'está em'],
  },
  MULTISELECT: {
    'está em': ['não está em', 'está em'],
    'não está em': ['está em', 'não está em'],
  },
  RELATION: {
    algum: ['algum'],
    nenhum: ['nenhum'],
    todos: ['todos'],
  },
};

export const buildRelationFilter = (condition: Condition, field: FilteringField, value: any) => {
  if (field.relationType === 'manyToOne') {
    return {
      [field.prismaField]: value,
    };
  } else {
    const [prismaOperator] =
      filterTypes[field.type as FilterType].prismaMapping[condition.operator];
    return {
      [field.prismaField]: {
        [prismaOperator]: value,
      },
    };
  }
};

const timestampFields: FilteringField[] = [
  {
    name: 'createdAt',
    label: 'Criado Em',
    type: 'DATE',
    inputType: 'date',
    prismaField: 'createdAt',
  },
  // {
  //   name: 'updatedAt',
  //   label: 'Atualizado Em',
  //   type: 'DATE',
  //   inputType: 'date',
  //   prismaField: 'updatedAt',
  // },
  // // {
  //   name: "deletedAt",
  //   label: "Deletado Em",
  //   type: "DATE",
  //   inputType: "date",
  //   prismaField: "deletedAt",
  // },
];

export function addTimestampsRecursively(fields: FilteringField[]): FilteringField[] {
  fields = [...fields, ...timestampFields];
  return fields.map((field) => {
    if (field.type === 'RELATION' && 'relationFilteringFields' in field) {
      return {
        ...field,
        relationFilteringFields: [
          ...(typeof field.relationFilteringFields === 'function'
            ? field.relationFilteringFields()
            : field.relationFilteringFields)!,
          ...timestampFields,
        ],
      };
    }
    return field;
  });
}

function getPrismaOperatorMapping() {
  const reverseMapping: Record<string, { type: FilterType; operator: string }> = {};

  Object.entries(filterTypes).forEach(([type, config]) => {
    Object.entries(config.prismaMapping).forEach(([operator, [prismaOp]]) => {
      reverseMapping[prismaOp] = { type: type as FilterType, operator };
    });
  });

  return reverseMapping;
}

function findMatchingField(
  prismaField: string,
  availableFields: FilteringField[]
): FilteringField | null {
  availableFields =
    typeof availableFields === 'function'
      ? (availableFields as FilteringFieldFunction)()
      : availableFields;

  const directMatch = availableFields.find((field) => field.prismaField === prismaField);
  if (directMatch) return directMatch;

  for (const field of availableFields) {
    let relationFields =
      typeof field.relationFilteringFields === 'function'
        ? (field.relationFilteringFields as FilteringFieldFunction)()
        : field.relationFilteringFields;

    if (field.relationFilteringFields) {
      const nestedField = findMatchingField(prismaField, relationFields!);
      if (nestedField) return nestedField;
    }
  }

  return null;
}

export function reverseEngineerConditions(
  prismaFilter: Record<string, any> | undefined | null,
  availableFields: FilteringField[]
): Condition[] {
  if (!prismaFilter) return [];
  const conditions: Condition[] = [];

  let fields =
    typeof availableFields === 'function'
      ? (availableFields as FilteringFieldFunction)()
      : availableFields;

  function processFilter(filter: Record<string, any>, parentPath: string = '') {
    Object.entries(filter).forEach(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}__${key}` : key;
      const field = findMatchingField(currentPath, fields);

      if (!field) return;

      if (
        value &&
        typeof value === 'object' &&
        ('some' in value || 'every' in value || 'none' in value)
      ) {
        const relationOperator = Object.keys(value)[0];
        let mappedOperator = '';
        switch (relationOperator) {
          case 'some':
            mappedOperator = 'algum';
            break;
          case 'every':
            mappedOperator = 'todos';
            break;
          case 'none':
            mappedOperator = 'nenhum';
            break;
        }

        conditions.push({
          id: Date.now() + Math.random(),
          field,
          operator: mappedOperator,
          value: value[relationOperator],
        });

        if (field.relationFilteringFields) {
          processFilter(value[relationOperator], key);
        }
        return;
      }

      if (value && typeof value === 'object' && ('gte' in value || 'lte' in value)) {
        const startDate =
          value.gte instanceof Date ? value.gte.toISOString().split('T')[0] : value.gte;
        const endDate =
          value.lte instanceof Date ? value.lte.toISOString().split('T')[0] : value.lte;

        conditions.push({
          id: Date.now() + Math.random(),
          field,
          operator: 'entre',
          value: `${startDate},${endDate}`,
        });
        return;
      }

      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([op, val]) => {
          let mappedOperator = '';

          switch (op) {
            case 'contains':
              mappedOperator = 'contém';
              break;
            case 'startsWith':
              mappedOperator = 'começa com';
              break;
            case 'endsWith':
              mappedOperator = 'termina com';
              break;
            case 'equals':
              mappedOperator = 'igual á';
              break;
            case 'not':
              mappedOperator = 'diferente de';
              break;
            case 'gt':
              if (filter.type === 'DATE') mappedOperator = 'depois de';
              else mappedOperator = 'maior que';

              break;
            case 'gte':
              if (filter.type === 'DATE') mappedOperator = 'maior ou igual á';
              else mappedOperator = 'maior ou igual á';

              break;
            case 'lt':
              if (filter.type === 'DATE') mappedOperator = 'antes de';
              else mappedOperator = 'menor que';

              break;
            case 'lte':
              if (filter.type === 'DATE') mappedOperator = 'menor ou igual á';
              else mappedOperator = 'menor ou igual á';

              break;
            case 'between':
              mappedOperator = 'entre';
              break;
            case 'in':
              mappedOperator = 'está em';
              break;
            case 'notIn':
              mappedOperator = 'não está em';
              break;
            case 'some':
              mappedOperator = 'algum';
              break;
            case 'none':
              mappedOperator = 'nenhum';
              break;
            case 'every':
              mappedOperator = 'todos';
              break;
            case 'is':
              mappedOperator = 'tem';
              break;
          }

          if (!mappedOperator) return;

          if (field.type === 'TEXT') {
            // if(!val?.mode){
            //   val = {...val, mode: 'insensitve'}
            // }
          }

          conditions.push({
            id: Date.now() + Math.random(),
            field,
            operator: mappedOperator,
            value: val,
          });
        });
      }
    });
  }

  processFilter(prismaFilter);
  return conditions;
}

export function buildPrismaFilterFromConditions(currentConditions: Condition[] = []) {
  let filter = {};
  if (currentConditions.length === 0) return;
  const groupedConditions = currentConditions.reduce((acc, condition) => {
    const key = condition.field.prismaField;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(condition);
    return acc;
  }, {} as Record<string, Condition[]>);

  filter = Object.entries(groupedConditions).reduce((acc, [fieldName, fieldConditions]) => {
    if (fieldConditions.length === 1) {
      // Single condition handling (same as before)
      const condition = fieldConditions[0];
      const { field, operator, value } = condition;
      if (!operator) return acc;
      const filterType = filterTypes[field.type as FilterType];
      const [prismaOperator] = filterType.prismaMapping[operator];

      if (field.type === 'RELATION') {
        acc[fieldName] = {
          [prismaOperator]: value,
        };
        // Handle relations based on their type
        if (field.relationType === 'manyToOne') {
          // For many-to-one relations
          acc[fieldName] = value;
        } else {
          // For one-to-many relations (existing logic)
          const [prismaOperatorRelation] =
            filterTypes[field.type as FilterType].prismaMapping[operator];
          acc[fieldName] = {
            [prismaOperatorRelation]: value,
          };
        }
      } else if (operator === 'entre') {
        if (value && value.includes(',')) {
          const [min, max] = value.split(',');
          if (field.type === 'DATE') {
            acc[fieldName] = {
              gte: new Date(min).toISOString(),
              lte: new Date(max).toISOString(),
            };
          } else {
            acc[fieldName] = {
              gte: Number(min),
              lte: Number(max),
            };
          }
        }
      } else if (field.type === 'MULTISELECT') {
        acc[fieldName] = {
          [prismaOperator]: Array.isArray(value) ? value : [value],
        };
      } else if (field.type === 'BOOLEAN') {
        acc[fieldName] = {
          [prismaOperator]: value === 'true' || value === true,
        };
      } else if (field.type === 'DATE') {
        if (value) {
          acc[fieldName] = {
            [prismaOperator]: new Date(value).toISOString(),
          };
        }
      } else if (field.type === 'TEXT') {
        acc[fieldName] = {
          [prismaOperator]: value,
          mode: 'insensitive',
        };
      } else {
        acc[fieldName] = {
          [prismaOperator]: value,
        };
      }
    } else {
      acc[fieldName] = fieldConditions.reduce((filters, condition) => {
        const { field, operator, value } = condition;
        if (!operator) return acc;
        const filterType = filterTypes[field.type as FilterType];
        const [prismaOperator] = filterType.prismaMapping[operator];

        let filterValue;
        if (prismaOperator === 'between') {
          if (field.type === 'DATE') {
            filterValue = {
              gte: new Date(value.split(',')[0]).toISOString(),
              lte: new Date(value.split(',')[1]).toISOString(),
            };
          } else {
            filterValue = {
              gte: value.split(',')[0],
              lte: value.split(',')[1],
            };
          }
        } else if (field.type === 'MULTISELECT') {
          filterValue = {
            [prismaOperator]: Array.isArray(value) ? value : [value],
          };
        } else if (field.type === 'BOOLEAN') {
          filterValue = {
            [prismaOperator]: value === 'true' || value === true,
          };
        } else if (field.type === 'TEXT') {
          filterValue = {
            [prismaOperator]: { ...value, mode: 'insensitive' },
          };
        } else {
          filterValue = { [prismaOperator]: value };
        }

        return { ...filters, ...filterValue };
      }, {});
    }

    return acc;
  }, {} as Record<string, any>);

  return filter;
}

export function convertToSearchParams(
  obj: Record<string, any>,
  parentKey = '',
  options: { keepAll: boolean } = { keepAll: false }
): string {
  const params: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = parentKey ? `${parentKey}[${key}]` : key;

    if (typeof value === 'object' && value !== null)
      params.push(convertToSearchParams(value, fullKey, options));
    else if (
      options?.keepAll ||
      (!fullKey.includes('[mode]') && typeof value === 'string' && value !== 'insensitive')
    )
      params.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
  }

  return params.join('&');
}

export function parseQueryString(queryString: string | null | undefined) {
  if (!queryString) return;
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    const keys = decodeURIComponent(key)
      .split('[')
      .map((k) => k.replace(']', ''));
    let current = result;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        current[k] = decodeURIComponent(value);
      } else {
        if (!current[k]) current[k] = {};
        current = current[k];
      }
    });
  });

  return result;
}
