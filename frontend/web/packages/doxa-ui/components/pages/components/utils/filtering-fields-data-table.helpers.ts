import { FilteringField } from '../../../ui/filter-builder/types';
import { BaseData } from '../list-page-table';

export function getValueCorrectFormForTableData(value: any) {
  return value !== null && value !== undefined ? String(value) : '-';
}

/**
 * Helper function to extract data from filtering fields and items
 * Returns an array of data objects instead of rendering components
 */
export function extractFilteringFieldsData({
  fields,
  items,
  selectedOptions = [],
}: {
  fields: FilteringField[];
  items: BaseData[];
  selectedOptions?: string[];
}): Record<string, string | number | boolean>[] {
  const result: Record<string, string | number | boolean>[] = [];

  // Process each item
  items.forEach((item) => {
    const baseItem: Record<string, string | number | boolean> = {};
    const relationItems: Record<string, string | number | boolean>[] = [];
    let hasRelationFields = false;

    // Process each field for the current item
    fields.forEach((field, index) => {
      let value = item[field.prismaField];

      // Handle date fields
      if (field.type === 'DATE' && value) {
        value = new Date(value).toUTCString();
      }

      // Handle relation fieldsé
      if (field.type === 'RELATION') {
        const fieldRelationFields =
          typeof field?.relationFilteringFields === 'function'
            ? field?.relationFilteringFields()
            : field?.relationFilteringFields;

        if (field.relationType?.endsWith('ToOne') && fieldRelationFields?.length) {
          hasRelationFields = true;
          const fieldItem = JSON.parse(JSON.stringify(value || ' '));

          // Process each relation field
          fieldRelationFields.forEach((relationField) => {
            const relationValue = fieldItem?.[relationField?.prismaField];
            let formattedValue = relationValue;

            // Handle date fields in relations
            if (relationField.type === 'DATE' && fieldItem?.[relationField?.prismaField]) {
              formattedValue = new Date(relationValue).toUTCString();
            }

            const fieldKey = `${field.label} (${relationField.label})`;

            // Only include if it's selected or it's the first field
            if (selectedOptions.includes(fieldKey) || index === 0) {
              // If this is the first relation field we're processing
              if (relationItems.length === 0) {
                // Copy the base item data we've collected so far
                relationItems.push({ ...baseItem });
              }

              // Add the relation field data to all relation items
              relationItems.forEach((item) => {
                item[fieldKey] = getValueCorrectFormForTableData(formattedValue);
              });
            }
          });
        } else if (field.relationType === 'oneToMany' || field.relationType === 'manyToMany') {
          // For collection relations, just store the count
          value = (value as [])?.length;
        }
      }

      // Handle normal fields (non-relation or relation without unpacking)
      const fieldKey = field.label;

      // Only include if it's selected or it's the first field
      if (selectedOptions.includes(fieldKey) || index === 0) {
        // Apply data transformer if available
        if (field.configs?.dataTransformer) {
          const transformedValue = field.configs.dataTransformer(item);
          if (typeof transformedValue?.props?.children === 'string') {
            value = transformedValue?.props?.children;
          }
        }

        // Store the value in the base item
        baseItem[fieldKey] = getValueCorrectFormForTableData(value);
      }
    });

    // If we have relation fields, add all relation items to the result
    if (hasRelationFields && relationItems.length > 0) {
      result.push(...relationItems);
    } else {
      // Otherwise just add the base item
      result.push(baseItem);
    }
  });

  return result;
}
