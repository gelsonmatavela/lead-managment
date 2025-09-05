import * as fs from "fs";
import * as path from "path";
import pluralize from "pluralize";

// @ts-ignore
import { kebabCase } from "change-case-all";

export function capitalize(text: string): string {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Configuration
const SCHEMA_FOLDER_PATH = "./prisma/schema";
const OUTPUT_FOLDER_PATH = "./.cache/filtering-fields";
const IGNORED_FIELDS = ["createdAt", "updatedAt", "id", "deletedAt"];
const IGNORED_PATTERNS = [/[iI][dD][sS]?$/]; // Matches fields ending with id, ids, Id, Ids, ID, IDs, IDS

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_FOLDER_PATH)) {
  fs.mkdirSync(OUTPUT_FOLDER_PATH, { recursive: true });
}

function capitalizeWords(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => capitalize(word))
    .join(" ");
}

function getFilterType(fieldType: string): string {
  // Remove any ? or [] from the type for the switch
  const baseType = fieldType.replace("?", "").replace("[]", "");

  switch (baseType) {
    case "String":
      return "TEXT";
    case "Int":
    case "Float":
    case "Decimal":
      return "NUMBER";
    case "Boolean":
      return "BOOLEAN";
    case "DateTime":
      return "DATE";
    default:
      // Assume it's a relation if it's not a primitive type
      return "RELATION";
  }
}

function getInputType(fieldType: string): string {
  // Remove any ? or [] from the type for the switch
  const baseType = fieldType.replace("?", "").replace("[]", "");

  switch (baseType) {
    case "String":
      return "text";
    case "Int":
    case "Float":
    case "Decimal":
      return "number";
    case "Boolean":
      return "checkbox";
    case "DateTime":
      return "date";
    default:
      // Assume it's a relation picker if it's not a primitive type
      return "relation-picker";
  }
}

function parseModels() {
  const schemaContent = getAllSchemaContent();
  const models: Record<string, any> = {};
  const enums = parseEnums(schemaContent);

  // Extract model definitions
  const modelRegex = /model\s+(\w+)\s*{([^}]*)}/g;
  let modelMatch;
  while ((modelMatch = modelRegex.exec(schemaContent)) !== null) {
    const [_, modelName, modelContent] = modelMatch;
    models[modelName] = parseModelFields(modelContent, enums);
  }

  return { models, enums };
}

function parseEnums(schemaContent: string) {
  const enums: Record<string, any> = {};
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  let enumMatch;

  while ((enumMatch = enumRegex.exec(schemaContent)) !== null) {
    const [_, enumName, enumContent] = enumMatch;
    const values = enumContent
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    enums[enumName] = values;
  }

  return enums;
}

function shouldIgnoreField(fieldName: string): boolean {
  // Check if field is in the explicit ignore list
  if (IGNORED_FIELDS.includes(fieldName)) return true;

  // Check if field matches any of the ignore patterns
  for (const pattern of IGNORED_PATTERNS) {
    if (pattern.test(fieldName)) return true;
  }

  return false;
}

function parseModelFields(modelContent: string, enums: Record<string, any>) {
  const fields = [];
  const lines = modelContent.split("\n");

  for (const line of lines) {
    if (!isFieldDefinition(line)) continue;

    const parts = line.trim().split(/\s+/);
    const fieldName = parts[0];
    const fieldType = parts[1];

    // Skip ignored fields
    if (shouldIgnoreField(fieldName)) continue;

    // Check if field type is an enum
    const isEnum =
      enums[fieldType.replace("?", "").replace("[]", "")] !== undefined;
    const enumValues = isEnum
      ? enums[fieldType.replace("?", "").replace("[]", "")]
      : null;

    // Check if it's a relation field
    // const isRelation = line.includes('@relation')
    const isRelation = !isEnum && !!getRelationType(line);
    const relationType = getRelationType(line);

    // Get the related model name if it's a relation
    const relatedModelName = isRelation
      ? getRelatedModelName(line, fieldType)
      : null;

    fields.push({
      name: fieldName,
      type: fieldType,
      isOptional: fieldType.includes("?"),
      isArray: fieldType.includes("[]"),
      isRelation,
      relationType,
      relatedModelName,
      isEnum,
      enumValues,
    });
  }

  return fields;
}

function getRelationType(line: string): string | null {
  // Determine relation type based on field type and @relation directive
  if (!line.includes("@relation")) return null;

  // If the field is an array (many side of a relation), it should be oneToMany
  if (line.includes("[]")) {
    return "oneToMany";
  }

  // Check for specific fields and references patterns
  if (line.includes("fields:") && line.includes("references:")) {
    // This indicates a foreign key relationship - the "one" side of a relation
    // So from this model's perspective, it's manyToOne
    return "manyToOne";
  }

  // For scalar fields without explicit relation info that have @relation
  if (!line.includes("fields:") && !line.includes("[]")) {
    // This is likely a one-to-one relation or the "one" side of one-to-many
    return "manyToOne";
  }

  // Default case
  return "manyToOne";
}

function getRelatedModelName(line: string, fieldType: string): string {
  // Extract the model name from a field type like "User" or "User[]"
  return fieldType.replace("[]", "").replace("?", "");
}

function getAllSchemaContent(): string {
  const files = fs
    .readdirSync(SCHEMA_FOLDER_PATH)
    .filter((file) => file.endsWith(".prisma"));

  let combinedSchema = "";
  for (const file of files) {
    const filePath = path.join(SCHEMA_FOLDER_PATH, file);
    const content = fs.readFileSync(filePath, "utf-8");
    combinedSchema += "\n" + content;
  }

  return combinedSchema;
}

function isFieldDefinition(line: string): boolean {
  // Ignore lines that start with @@ (model attributes)
  if (line.trim().startsWith("@@")) return false;

  // Ignore empty lines and comments
  if (!line.trim() || line.trim().startsWith("//")) return false;

  // Must start with a valid field name (letter or underscore)
  if (!/^\s*[a-zA-Z_]\w*\s/.test(line)) return false;

  // Must have at least a name and type
  const parts = line.trim().split(/\s+/);
  if (parts.length < 2) return false;

  return true;
}

function toLowerCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateFilteringFieldsFiles(models: any[], enums: any) {
  for (const [modelName, fields] of Object.entries(models)) {
    // Create variable and file names
    const modelVarName = kebabCase(modelName);
    const variableName = toLowerCamelCase(modelName) + "FilteringFields";
    const modelFileName = `${kebabCase(modelVarName)}-filtering-fields.tsx`;
    const outputPath = path.join(OUTPUT_FOLDER_PATH, modelFileName);

    // Generate file content
    let fileContent = `import { FilteringField } from "@/packages/doxa-ui/components/ui/filter-builder/types";\n`;

    // Add imports for relation models
    const uniqueRelations = new Set();
    fields.forEach((field: any) => {
      if (field.isRelation && field.relatedModelName) {
        uniqueRelations.add(field.relatedModelName);
      }
    });

    uniqueRelations.forEach((relatedModel: any) => {
      const relatedModelKebab = kebabCase(relatedModel.toString());
      const pluralizedModel = pluralize.plural(relatedModelKebab as string);
      const relatedVarName =
        toLowerCamelCase(relatedModel.toString()) + "FilteringFields";
      fileContent += `import { ${relatedVarName} } from "../../${pluralizedModel}/utils/${relatedModelKebab}-filtering-fields";\n`;
    });

    fileContent += `\nexport const ${variableName}: FilteringField[] = [\n`;

    // Add fields
    fields.forEach((field: any) => {
      fileContent += `  {\n`;
      fileContent += `    name: "${field.name}",\n`;
      fileContent += `    label: "${capitalizeWords(field.name)}",\n`;

      // Handle enum fields
      if (field.isEnum) {
        fileContent += `    type: "SELECT",\n`;
        fileContent += `    inputType: "select",\n`;
        fileContent += `    options: ${JSON.stringify(field.enumValues)},\n`;
      } else {
        fileContent += `    type: "${getFilterType(field.type)}",\n`;
        fileContent += `    inputType: "${getInputType(field.type)}",\n`;
      }

      fileContent += `    prismaField: "${field.name}",\n`;

      // Add relation specific fields
      if (field.isRelation) {
        fileContent += `    relationType: "${field.relationType}",\n`;

        // Add reference to the related model's filtering fields
        if (field.relatedModelName) {
          const relatedVarName =
            toLowerCamelCase(field.relatedModelName.toString()) +
            "FilteringFields";
          fileContent += `    relationFilteringFields: () => ${relatedVarName},\n`;
        }
      }

      fileContent += `  },\n`;
    });

    fileContent += `];\n`;

    // Write the file
    fs.writeFileSync(outputPath, fileContent);
    // console.log(`Generated filtering fields for ${modelName} at ${outputPath}`)
  }
}

function main() {
  const { models, enums } = parseModels();
  console.log(models);
  console.log("---------------------");
  console.log(enums);
  generateFilteringFieldsFiles(models as any, enums);
  console.log("All filtering fields files generated successfully!");
}

// Run the generator
main();
