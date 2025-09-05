export type FilterType =
  | 'TEXT'
  | 'NUMBER'
  | 'DATE'
  | 'SELECT'
  | 'MULTISELECT'
  | 'BOOLEAN'
  | 'RELATION';

export type Filter = {
  id: number;
  field: string;
  type: FilterType;
  operator: string;
  value: string | string[] | boolean;
  value2?: string | string[] | boolean;
};

export type FilteringFieldFunction = () => FilteringField[];

export type FilteringField<T = any> = {
  name: string;
  label: string;
  linkTo?: string;
  type: FilterType;
  inputType: string;
  options?: string[];
  prismaField: string;
  relationType?: 'manyToOne' | 'oneToOne' | 'oneToMany';
  relationFilteringFields?: FilteringField[] | FilteringFieldFunction;
  configs?: {
    className?: string;
    dataTransformer?: (data: T) => React.Node | string | number;
  };
  sum?: true;
};

type Condition = {
  id: number;
  field: FilteringField;
  operator: string;
  value: any;
};
