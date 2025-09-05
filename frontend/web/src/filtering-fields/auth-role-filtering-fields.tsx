import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";

export const authRoleFilteringFields: FilteringField[] = [
  {
    name: "name",
    label: "Name",
    type: "TEXT",
    inputType: "text",
    prismaField: "name",
  },
  {
    name: "description",
    label: "Description",
    type: "TEXT",
    inputType: "text",
    prismaField: "description",
  },
  {
    name: "permissions",
    label: "Permissions",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "permissions",
  },
  {
    name: "users",
    label: "Users",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "users",
  },
];
