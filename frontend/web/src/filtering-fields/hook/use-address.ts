import { addressFilteringFields } from "../address-filtering-fields";

 export const useAddressFilters = () => {
  const transformData = (fieldName: string, data: any) => {
    const field = addressFilteringFields.find(f => f.name === fieldName);
    if (field?.dataTransformer) {
      return field.dataTransformer(data);
    }
    return data;
  };

  return { transformData, fields: addressFilteringFields };
};