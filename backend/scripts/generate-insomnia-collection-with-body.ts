import fs from "fs";
import path from "path";

// The routes data from your original JSON
const routes = [
  {
    method: "GET",
    path: "/api",
  },
  {
    method: "GET",
    path: "/available-routes",
  },
  {
    method: "GET",
    path: "/available-resources",
  },
  {
    method: "POST",
    path: "/attendance-logs",
  },
  {
    method: "GET",
    path: "/attendance-logs",
  },
  {
    method: "POST",
    path: "/attendance-logs/many",
  },
  {
    method: "PATCH",
    path: "/attendance-logs/many",
  },
  {
    method: "DELETE",
    path: "/attendance-logs/many",
  },
  {
    method: "GET",
    path: "/attendance-logs/:id",
  },
  {
    method: "PATCH",
    path: "/attendance-logs/:id",
  },
  {
    method: "DELETE",
    path: "/attendance-logs/:id",
  },
  {
    method: "POST",
    path: "/auth-roles",
  },
  {
    method: "GET",
    path: "/auth-roles",
  },
  {
    method: "POST",
    path: "/auth-roles/many",
  },
  {
    method: "PATCH",
    path: "/auth-roles/many",
  },
  {
    method: "DELETE",
    path: "/auth-roles/many",
  },
  {
    method: "GET",
    path: "/auth-roles/:id",
  },
  {
    method: "PATCH",
    path: "/auth-roles/:id",
  },
  {
    method: "DELETE",
    path: "/auth-roles/:id",
  },
  {
    method: "POST",
    path: "/auth-permissions",
  },
  {
    method: "GET",
    path: "/auth-permissions",
  },
  {
    method: "POST",
    path: "/auth-permissions/many",
  },
  {
    method: "PATCH",
    path: "/auth-permissions/many",
  },
  {
    method: "DELETE",
    path: "/auth-permissions/many",
  },
  {
    method: "GET",
    path: "/auth-permissions/:id",
  },
  {
    method: "PATCH",
    path: "/auth-permissions/:id",
  },
  {
    method: "DELETE",
    path: "/auth-permissions/:id",
  },
  {
    method: "POST",
    path: "/user-roles",
  },
  {
    method: "GET",
    path: "/user-roles",
  },
  {
    method: "POST",
    path: "/user-roles/many",
  },
  {
    method: "PATCH",
    path: "/user-roles/many",
  },
  {
    method: "DELETE",
    path: "/user-roles/many",
  },
  {
    method: "GET",
    path: "/user-roles/:id",
  },
  {
    method: "PATCH",
    path: "/user-roles/:id",
  },
  {
    method: "DELETE",
    path: "/user-roles/:id",
  },
  {
    method: "POST",
    path: "/memberships",
  },
  {
    method: "GET",
    path: "/memberships",
  },
  {
    method: "POST",
    path: "/memberships/many",
  },
  {
    method: "PATCH",
    path: "/memberships/many",
  },
  {
    method: "DELETE",
    path: "/memberships/many",
  },
  {
    method: "GET",
    path: "/memberships/:id",
  },
  {
    method: "PATCH",
    path: "/memberships/:id",
  },
  {
    method: "DELETE",
    path: "/memberships/:id",
  },
  {
    method: "POST",
    path: "/staff-profile-trainer-specialities",
  },
  {
    method: "GET",
    path: "/staff-profile-trainer-specialities",
  },
  {
    method: "POST",
    path: "/staff-profile-trainer-specialities/many",
  },
  {
    method: "PATCH",
    path: "/staff-profile-trainer-specialities/many",
  },
  {
    method: "DELETE",
    path: "/staff-profile-trainer-specialities/many",
  },
  {
    method: "GET",
    path: "/staff-profile-trainer-specialities/:id",
  },
  {
    method: "PATCH",
    path: "/staff-profile-trainer-specialities/:id",
  },
  {
    method: "DELETE",
    path: "/staff-profile-trainer-specialities/:id",
  },
  {
    method: "POST",
    path: "/customer-memberships",
  },
  {
    method: "GET",
    path: "/customer-memberships",
  },
  {
    method: "POST",
    path: "/customer-memberships/many",
  },
  {
    method: "PATCH",
    path: "/customer-memberships/many",
  },
  {
    method: "DELETE",
    path: "/customer-memberships/many",
  },
  {
    method: "GET",
    path: "/customer-memberships/:id",
  },
  {
    method: "PATCH",
    path: "/customer-memberships/:id",
  },
  {
    method: "DELETE",
    path: "/customer-memberships/:id",
  },
  {
    method: "POST",
    path: "/trainer-specialities",
  },
  {
    method: "GET",
    path: "/trainer-specialities",
  },
  {
    method: "POST",
    path: "/trainer-specialities/many",
  },
  {
    method: "PATCH",
    path: "/trainer-specialities/many",
  },
  {
    method: "DELETE",
    path: "/trainer-specialities/many",
  },
  {
    method: "GET",
    path: "/trainer-specialities/:id",
  },
  {
    method: "PATCH",
    path: "/trainer-specialities/:id",
  },
  {
    method: "DELETE",
    path: "/trainer-specialities/:id",
  },
  {
    method: "POST",
    path: "/addresses",
  },
  {
    method: "GET",
    path: "/addresses",
  },
  {
    method: "POST",
    path: "/addresses/many",
  },
  {
    method: "PATCH",
    path: "/addresses/many",
  },
  {
    method: "DELETE",
    path: "/addresses/many",
  },
  {
    method: "GET",
    path: "/addresses/:id",
  },
  {
    method: "PATCH",
    path: "/addresses/:id",
  },
  {
    method: "DELETE",
    path: "/addresses/:id",
  },
  {
    method: "POST",
    path: "/discount-types",
  },
  {
    method: "GET",
    path: "/discount-types",
  },
  {
    method: "POST",
    path: "/discount-types/many",
  },
  {
    method: "PATCH",
    path: "/discount-types/many",
  },
  {
    method: "DELETE",
    path: "/discount-types/many",
  },
  {
    method: "GET",
    path: "/discount-types/:id",
  },
  {
    method: "PATCH",
    path: "/discount-types/:id",
  },
  {
    method: "DELETE",
    path: "/discount-types/:id",
  },
  {
    method: "POST",
    path: "/payments",
  },
  {
    method: "GET",
    path: "/payments",
  },
  {
    method: "POST",
    path: "/payments/many",
  },
  {
    method: "PATCH",
    path: "/payments/many",
  },
  {
    method: "DELETE",
    path: "/payments/many",
  },
  {
    method: "GET",
    path: "/payments/:id",
  },
  {
    method: "PATCH",
    path: "/payments/:id",
  },
  {
    method: "DELETE",
    path: "/payments/:id",
  },
  {
    method: "POST",
    path: "/public-profiles",
  },
  {
    method: "GET",
    path: "/public-profiles",
  },
  {
    method: "POST",
    path: "/public-profiles/many",
  },
  {
    method: "PATCH",
    path: "/public-profiles/many",
  },
  {
    method: "DELETE",
    path: "/public-profiles/many",
  },
  {
    method: "GET",
    path: "/public-profiles/:id",
  },
  {
    method: "PATCH",
    path: "/public-profiles/:id",
  },
  {
    method: "DELETE",
    path: "/public-profiles/:id",
  },
  {
    method: "POST",
    path: "/staff-profiles",
  },
  {
    method: "GET",
    path: "/staff-profiles",
  },
  {
    method: "POST",
    path: "/staff-profiles/many",
  },
  {
    method: "PATCH",
    path: "/staff-profiles/many",
  },
  {
    method: "DELETE",
    path: "/staff-profiles/many",
  },
  {
    method: "GET",
    path: "/staff-profiles/:id",
  },
  {
    method: "PATCH",
    path: "/staff-profiles/:id",
  },
  {
    method: "DELETE",
    path: "/staff-profiles/:id",
  },
  {
    method: "POST",
    path: "/training-goals",
  },
  {
    method: "GET",
    path: "/training-goals",
  },
  {
    method: "POST",
    path: "/training-goals/many",
  },
  {
    method: "PATCH",
    path: "/training-goals/many",
  },
  {
    method: "DELETE",
    path: "/training-goals/many",
  },
  {
    method: "GET",
    path: "/training-goals/:id",
  },
  {
    method: "PATCH",
    path: "/training-goals/:id",
  },
  {
    method: "DELETE",
    path: "/training-goals/:id",
  },
  {
    method: "POST",
    path: "/update-logs",
  },
  {
    method: "GET",
    path: "/update-logs",
  },
  {
    method: "POST",
    path: "/update-logs/many",
  },
  {
    method: "PATCH",
    path: "/update-logs/many",
  },
  {
    method: "DELETE",
    path: "/update-logs/many",
  },
  {
    method: "GET",
    path: "/update-logs/:id",
  },
  {
    method: "PATCH",
    path: "/update-logs/:id",
  },
  {
    method: "DELETE",
    path: "/update-logs/:id",
  },
  {
    method: "POST",
    path: "/users",
  },
  {
    method: "GET",
    path: "/users",
  },
  {
    method: "POST",
    path: "/users/many",
  },
  {
    method: "PATCH",
    path: "/users/many",
  },
  {
    method: "DELETE",
    path: "/users/many",
  },
  {
    method: "GET",
    path: "/users/:id",
  },
  {
    method: "PATCH",
    path: "/users/:id",
  },
  {
    method: "DELETE",
    path: "/users/:id",
  },
  {
    method: "POST",
    path: "/uploads/:fileType",
  },
  {
    method: "DELETE",
    path: "/uploads/:fileType/:fileName",
  },
];

// Define types for the routes and collection
interface Route {
  method: string;
  path: string;
}

interface InsomniaResource {
  _id: string;
  parentId: string | null;
  modified: string;
  created: string;
  name: string;
  description?: string;
  _type: string;
  url?: string;
  method?: string;
  body?: {
    mimeType?: string;
    text?: string;
  };
  parameters?: Array<{
    id: string;
    name: string;
    value: string;
    description: string;
    disabled: boolean;
  }>;
  headers?: Array<{
    name: string;
    value: string;
  }>;
  authentication?: Record<string, unknown>;
  metaSortKey?: number;
  environment?: Record<string, unknown>;
  environmentPropertyOrder?: null;
  isPrivate?: boolean;
  settingStoreCookies?: boolean;
  settingSendCookies?: boolean;
  settingDisableRenderRequestBody?: boolean;
  settingEncodeUrl?: boolean;
  settingRebuildPath?: boolean;
  settingFollowRedirects?: string;
}

interface InsomniaCollection {
  _type: string;
  __export_format: number;
  __export_date: string;
  __export_source: string;
  resources: InsomniaResource[];
}

interface ResourceRoutes {
  findMany?: Route;
  findOne?: Route;
  createOne?: Route;
  createMany?: Route;
  updateOne?: Route;
  updateMany?: Route;
  deleteOne?: Route;
  deleteMany?: Route;
}

function generateInsomniaCollection(routes: Route[]): InsomniaCollection {
  // Unique resource types
  const resourceTypes: string[] = [
    ...new Set(routes.map((route) => route.path.split("/")[1] || "root")),
  ];

  // Base collection structure
  const collection: InsomniaCollection = {
    _type: "export",
    __export_format: 4,
    __export_date: new Date().toISOString(),
    __export_source: "script-generated",
    resources: [],
  };

  // Add workspace
  collection.resources.push({
    _id: "wrk_arkos",
    parentId: null,
    modified: new Date().toISOString(),
    created: new Date().toISOString(),
    name: "Arkos API",
    description: "Automatically generated Arkos API collection",
    _type: "workspace",
  });

  // Group routes by resource type
  const routesByResource: Record<string, ResourceRoutes> = resourceTypes.reduce(
    (acc, resourceType) => {
      if (resourceType === "root") return acc;

      acc[resourceType] = {
        findMany: routes.find(
          (r) => r.method === "GET" && r.path === `/${resourceType}`
        ),
        findOne: routes.find(
          (r) => r.method === "GET" && r.path === `/${resourceType}/:id`
        ),
        createOne: routes.find(
          (r) => r.method === "POST" && r.path === `/${resourceType}`
        ),
        createMany: routes.find(
          (r) => r.method === "POST" && r.path === `/${resourceType}/many`
        ),
        updateOne: routes.find(
          (r) => r.method === "PATCH" && r.path === `/${resourceType}/:id`
        ),
        updateMany: routes.find(
          (r) => r.method === "PATCH" && r.path === `/${resourceType}/many`
        ),
        deleteOne: routes.find(
          (r) => r.method === "DELETE" && r.path === `/${resourceType}/:id`
        ),
        deleteMany: routes.find(
          (r) => r.method === "DELETE" && r.path === `/${resourceType}/many`
        ),
      };

      return acc;
    },
    {} as Record<string, any>
  );

  // Create folders and requests for each resource type
  Object.entries(routesByResource).forEach(
    ([resourceType, resourceRoutes], index) => {
      // Main resource folder
      const folderId = `fld_${resourceType}`;
      collection.resources.push({
        _id: folderId,
        parentId: "wrk_arkos",
        modified: new Date().toISOString(),
        created: new Date().toISOString(),
        name: resourceType
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        description: `${resourceType
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} endpoints`,
        environment: {},
        environmentPropertyOrder: null,
        metaSortKey: -1000 + index * 100,
        _type: "request_group",
      });

      // Create specific method requests
      const methodMappings = [
        { key: "findMany", name: "Find Many", method: "GET" },
        { key: "findOne", name: "Find One", method: "GET" },
        { key: "createOne", name: "Create One", method: "POST" },
        { key: "createMany", name: "Create Many", method: "POST" },
        { key: "updateOne", name: "Update One", method: "PATCH" },
        { key: "updateMany", name: "Update Many", method: "PATCH" },
        { key: "deleteOne", name: "Delete One", method: "DELETE" },
        { key: "deleteMany", name: "Delete Many", method: "DELETE" },
      ];

      methodMappings.forEach((mapping, routeIndex) => {
        const route = resourceRoutes[mapping.key as keyof ResourceRoutes];
        if (!route) return;

        const reqId = `req_${resourceType}_${mapping.key}`;

        collection.resources.push({
          _id: reqId,
          parentId: folderId,
          modified: new Date().toISOString(),
          created: new Date().toISOString(),
          url: `{{BASE_URL}}/api${route.path}`,
          name: mapping.name,
          description: `${mapping.method} request for ${route.path}`,
          method: route.method,
          body:
            route.method !== "GET"
              ? {
                  mimeType: "application/json",
                  text:
                    route.method === "POST" || route.method === "PATCH"
                      ? route.path.includes("/many")
                        ? "[{}]" // array for many
                        : "{}" // object for single
                      : "[]", // array for delete
                }
              : {},
          parameters: route.path.includes(":")
            ? route.path
                .split("/")
                .filter((p) => p.startsWith(":"))
                .map((param) => ({
                  id: `par_${param.slice(1)}`,
                  name: param.slice(1),
                  value: "",
                  description: `${param.slice(1)} parameter`,
                  disabled: false,
                }))
            : [],
          headers:
            route.method !== "GET"
              ? [
                  {
                    name: "Content-Type",
                    value: "application/json",
                  },
                ]
              : [],
          authentication: {},
          metaSortKey: -1000 + routeIndex * 10,
          isPrivate: false,
          settingStoreCookies: true,
          settingSendCookies: true,
          settingDisableRenderRequestBody: false,
          settingEncodeUrl: true,
          settingRebuildPath: true,
          settingFollowRedirects: "global",
          _type: "request",
        });
      });
    }
  );

  // Add root routes (api, available-routes)
  const rootFolderId = "fld_root";
  collection.resources.push({
    _id: rootFolderId,
    parentId: "wrk_arkos",
    modified: new Date().toISOString(),
    created: new Date().toISOString(),
    name: "Root",
    description: "Root API endpoints",
    environment: {},
    environmentPropertyOrder: null,
    metaSortKey: -100,
    _type: "request_group",
  });

  const rootRoutes = routes.filter(
    (route) => route.path === "/api" || route.path === "/available-routes"
  );
  rootRoutes.forEach((route, index) => {
    collection.resources.push({
      _id: `req_root_${route.path.slice(1)}`,
      parentId: rootFolderId,
      modified: new Date().toISOString(),
      created: new Date().toISOString(),
      url: `{{BASE_URL}}/api${route.path}`,
      name: route.path === "/api" ? "Welcome" : "Available Routes",
      description: `${route.method} request for ${route.path}`,
      method: route.method,
      body: {},
      parameters: [],
      headers: [],
      authentication: {},
      metaSortKey: -1000 + index * 10,
      isPrivate: false,
      settingStoreCookies: true,
      settingSendCookies: true,
      settingDisableRenderRequestBody: false,
      settingEncodeUrl: true,
      settingRebuildPath: true,
      settingFollowRedirects: "global",
      _type: "request",
    });
  });

  return collection;
}

// Example usage
function main() {
  // Generate the collection
  const insomniaCollection = generateInsomniaCollection(routes);

  // Write to file
  fs.writeFileSync(
    path.join(__dirname, "arkos-insomnia-collection.json"),
    JSON.stringify(insomniaCollection, null, 2)
  );

  console.log("Insomnia collection generated successfully!");
}

// Run the main function
main();
