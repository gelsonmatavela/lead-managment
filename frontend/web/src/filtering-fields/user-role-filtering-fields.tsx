import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { userFilteringFields } from "./user-filtering-fields";
import { authRoleFilteringFields } from "./auth-role-filtering-fields";

export const userRoleFilteringFields: FilteringField[] = [
  {
    name: "user",
    label: "User",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "user",
    relationType: "manyToOne",
    relationFilteringFields: () => userFilteringFields,
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
