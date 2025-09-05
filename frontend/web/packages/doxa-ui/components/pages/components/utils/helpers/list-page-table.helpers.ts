import { FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';

export function isColumnLabelSelected(selectedOptions: string[], field: FilteringField) {
  if (field?.relationType?.endsWith('ToOne')) {
    const nestedFields =
      typeof field.relationFilteringFields === 'function'
        ? field.relationFilteringFields()
        : field.relationFilteringFields;

    return selectedOptions.some((option) => {
      return nestedFields?.find((field) => field.label === option);
    });
  } else return !!selectedOptions.includes(field.label);
}
