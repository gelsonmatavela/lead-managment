import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";
import { dataTransformers } from "./data-transformer/data-transformar";

export const addressFilteringFields: FilteringField[] = [
  {
    name: "country",
    label: "País",
    type: "TEXT",
    inputType: "text",
    prismaField: "country",
    placeholder: "Digite o nome do país...",
    dataTransformer: dataTransformers.countryTransformer,
    validation: {
      minLength: 2,
      maxLength: 50,
    },
  },
  {
    name: "state",
    label: "Estado/Província",
    type: "TEXT",
    inputType: "text",
    prismaField: "state",
    placeholder: "Digite o estado ou província...",
    dataTransformer: dataTransformers.stateTransformer,
    validation: {
      minLength: 2,
      maxLength: 50,
    },
  },
  {
    name: "city",
    label: "Cidade",
    type: "TEXT",
    inputType: "text",
    prismaField: "city",
    placeholder: "Digite o nome da cidade...",
    dataTransformer: dataTransformers.cityTransformer,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "neighborhood",
    label: "Bairro",
    type: "TEXT",
    inputType: "text",
    prismaField: "neighborhood",
    placeholder: "Digite o nome do bairro...",
    dataTransformer: dataTransformers.neighborhoodTransformer,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "street",
    label: "Rua",
    type: "TEXT",
    inputType: "text",
    prismaField: "street",
    placeholder: "Digite o nome da rua...",
    validation: {
      minLength: 3,
      maxLength: 200,
    },
  },
  {
    name: "companies",
    label: "Empresas",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "companies",
    placeholder: "Selecione uma ou mais empresas...",
    dataTransformer: dataTransformers.companyTransformer,
    relationConfig: {
      displayField: "name",
      searchFields: ["name", "industry"],
      multiple: true,
      virtualScroll: true,
      loadOnScroll: true,
      minSearchLength: 2,
    },
  },
  {
    name: "users",
    label: "Usuários",
    type: "RELATION",
    inputType: "relation-picker",
    prismaField: "users",
    placeholder: "Selecione um ou mais usuários...",
    dataTransformer: dataTransformers.userTransformer,
    relationConfig: {
      displayField: "name",
      searchFields: ["name", "email", "role"],
      multiple: true,
      virtualScroll: true,
      loadOnScroll: true,
      minSearchLength: 1,
      preloadLimit: 20,
      // Ordenação padrão
      defaultSort: [
        { field: "name", direction: "asc" },
        { field: "email", direction: "asc" }
      ],
    },
  },
];

// Exemplo de como usar com dados reais
export const sampleData = {
  users: [
    {
      id: 1,
      name: "Ana Silva",
      email: "ana.silva@empresa.com",
      role: "Manager",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
      isOnline: true,
    },
    {
      id: 2,
      name: "Carlos Santos",
      email: "carlos.santos@empresa.com",
      role: "Developer",
      avatar: null,
      isOnline: false,
    },
    {
      id: 3,
      name: "Maria Oliveira",
      email: "maria.oliveira@empresa.com",
      role: "Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      isOnline: true,
    },
  ],
  companies: [
    {
      id: 1,
      name: "TechCorp Solutions",
      industry: "Technology",
    },
    {
      id: 2,
      name: "Marketing Plus",
      industry: "Marketing",
    },
  ],
};