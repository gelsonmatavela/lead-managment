import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";

export const addressFilteringFields: FilteringField[] = [
  {
    name: "country",
    label: "Country",
    type: "TEXT",
    inputType: "text",
    prismaField: "country",
  },
  {
    name: "state",
    label: "State",
    type: "TEXT",
    inputType: "text",
    prismaField: "state",
  },
  {
    name: "city",
    label: "City",
    type: "TEXT",
    inputType: "text",
    prismaField: "city",
  },
  {
    name: "neighborhood",
    label: "Neighborhood",
    type: "TEXT",
    inputType: "text",
    prismaField: "neighborhood",
  },
  {
    name: "street",
    label: "Street",
    type: "TEXT",
    inputType: "text",
    prismaField: "street",
  },
  {
    name: "companies",
    label: "Companies",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "companies",
  },
  {
    name: "users",
    label: "Users",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "users",
  },
];
