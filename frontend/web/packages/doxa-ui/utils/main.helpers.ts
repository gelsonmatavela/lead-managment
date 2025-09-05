import { FilteringField } from '@/packages/doxa-ui/components/ui/filter-builder/types';

export function getGenericTableHeadersLabelsFromFilteringFields(filteringFieds: FilteringField[]) {
  let labels: string[] = [];

  filteringFieds.map((field, i: number) => {
    let value = field.label;

    if (field.type === 'RELATION') {
      // if (data[0][field.prismaField] === undefined) return;

      if (field.relationType === 'manyToOne') {
        const fieldRelationFields =
          typeof field?.relationFilteringFields === 'function'
            ? field?.relationFilteringFields()
            : field?.relationFilteringFields;

        let relationFieldLabels: string[] = [];
        for (let j = 0; j < fieldRelationFields!.length; j++) {
          const relationValue = `${field.label} (${fieldRelationFields![j].label})`;
          !relationFieldLabels.includes(relationValue) && relationFieldLabels.push(relationValue);
        }

        labels = [...labels, ...relationFieldLabels];
      } else labels.push(value);
    } else labels.push(value);
  });

  return labels;
}

type Primitive = string | number | boolean | null | undefined;
type DeepObject = { [key: string]: Primitive | DeepObject | Array<any> };

const IGNORED_FIELDS = ['createdAt', 'updatedAt', 'deletedAt', 'id'];

/**
 * Compares two objects and returns an object containing only the differences,
 * ignoring timestamp-related fields at any nesting level.
 * @param base - The base object to compare against
 * @param modified - The modified object to compare with the base
 * @returns The difference object, undefined if no differences, or null if item was deleted
 */
export function getFormChangedValues<T extends DeepObject>(
  base: T | undefined | null,
  modified: T | undefined | null,
  path: string[] = []
): Partial<T> | undefined | null {
  // Handle null/undefined cases
  if (base === modified) return undefined;
  if (!base) return modified;
  if (!modified) return null;

  // Handle different types
  if (typeof base !== typeof modified) return modified;
  if (typeof base !== 'object') return base === modified ? undefined : modified;

  // Handle arrays
  if (Array.isArray(base)) {
    if (!Array.isArray(modified)) return modified;
    if (base.length === 0 && modified.length === 0) return undefined;

    // For arrays, compare each element
    const arrayDiff = modified.filter((item, index) => {
      if (index >= base.length) return true; // New items
      const elementDiff = getFormChangedValues(base[index], item, [...path, index.toString()]);
      return elementDiff !== undefined;
    });

    return arrayDiff.length > 0 ? (arrayDiff as any) : modified;
  }

  const changes: Partial<T> = {};
  let hasChanges = false;

  // Combine all keys from both objects
  const allKeys = new Set([...Object.keys(base), ...Object.keys(modified)]);

  for (const key of allKeys) {
    // Skip ignored timestamp fields
    if (IGNORED_FIELDS.includes(key)) continue;

    const currentPath = [...path, key];

    // Handle deleted properties
    if (!(key in modified)) {
      (changes[key as keyof T] as any) = undefined;
      hasChanges = true;
      continue;
    }

    // Handle new or modified properties
    if (!(key in base)) {
      (changes[key as keyof T] as any) = (modified as any)[key];
      hasChanges = true;
      continue;
    }

    const diff = getFormChangedValues((base as any)[key], (modified as any)[key], currentPath);

    if (diff !== undefined) {
      (changes[key as keyof T] as any) = diff;
      hasChanges = true;
    }
  }

  return hasChanges ? changes : undefined;
}
