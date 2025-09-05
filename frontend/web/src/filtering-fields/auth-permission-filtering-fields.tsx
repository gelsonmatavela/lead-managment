import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { authRoleFilteringFields } from "./auth-role-filtering-fields";

export const authPermissionFilteringFields: FilteringField[] = [
  {
    name: "resource",
    label: "Resource",
    type: "TEXT",
    inputType: "text",
    prismaField: "resource",
  },
  {
    name: "action",
    label: "Action",
    type: "SELECT",
    inputType: "select",
    options: ["View","Create","Update","Delete","// Add more custom actions"],
    prismaField: "action",
  },
  {
    name: "role",
    label: "Role",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "role",
    relationType: "manyToOne",
    relationFilteringFields: () => authRoleFilteringFields,
  },
];
