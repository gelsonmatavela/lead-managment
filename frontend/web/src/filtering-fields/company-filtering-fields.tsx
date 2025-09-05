import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { staffFilteringFields } from "./staff-filtering-fields";
import { addressFilteringFields } from "./address-filtering-fields";

export const companyFilteringFields: FilteringField[] = [
  {
    name: "logo",
    label: "Logo",
    type: "TEXT",
    inputType: "text",
    prismaField: "logo",
  },
  {
    name: "leaders",
    label: "Leaders",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "leaders",
    relationType: "oneToMany",
    relationFilteringFields: () => staffFilteringFields,
  },
  {
    name: "staffs",
    label: "Staffs",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "staffs",
  },
  {
    name: "address",
    label: "Address",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "address",
    relationType: "manyToOne",
    relationFilteringFields: () => addressFilteringFields,
  },
  {
    name: "name",
    label: "Name",
    type: "TEXT",
    inputType: "text",
    prismaField: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "TEXT",
    inputType: "text",
    prismaField: "email",
  },
  {
    name: "phone1",
    label: "Phone1",
    type: "TEXT",
    inputType: "text",
    prismaField: "phone1",
  },
  {
    name: "phone2",
    label: "Phone2",
    type: "TEXT",
    inputType: "text",
    prismaField: "phone2",
  },
];
