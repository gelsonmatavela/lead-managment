import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { companyFilteringFields } from "./company-filtering-fields";
import { userFilteringFields } from "./user-filtering-fields";

export const staffFilteringFields: FilteringField[] = [
  {
    name: "companyCode",
    label: "Company Code",
    type: "TEXT",
    inputType: "text",
    prismaField: "companyCode",
  },
  {
    name: "company",
    label: "Company",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "company",
    relationType: "manyToOne",
    relationFilteringFields: () => companyFilteringFields,
  },
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
    name: "companyAsLeader",
    label: "Company As Leader",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "companyAsLeader",
    relationType: "oneToMany",
    relationFilteringFields: () => companyFilteringFields,
  },
];
