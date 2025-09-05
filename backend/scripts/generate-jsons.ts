import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generatePlaceholder(type: string, isEnum = false): any {
  if (isEnum) return "ENUM_VALUE";

  switch (type.toLowerCase()) {
    case "string":
      return "placeholder_string";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "date":
      return new Date().toISOString();
    default:
      return null;
  }
}

function extractDtoProperties(dtoClass: any): Record<string, any> {
  const result: Record<string, any> = {};

  // Ensure the prototype exists and has metadata
  if (!dtoClass || !dtoClass.prototype) return result;

  const metadata = dtoClass.prototype;

  // Get all properties with decorators
  Object.keys(metadata).forEach((key) => {
    if (key.startsWith("__")) return;

    try {
      // Get property type and decorators
      const propertyType = (Reflect as any).getMetadata(
        "design:type",
        metadata,
        key
      );
      const decorators = metadata[key]?.decorators || [];

      const isOptional = decorators.some(
        (dec: any) => dec.name === "IsOptional"
      );
      const isEnum = decorators.some((dec: any) => dec.name === "IsEnum");

      // Handle arrays
      if (propertyType === Array) {
        const arrayItemType = (Reflect as any).getMetadata(
          "design:type",
          metadata[key]
        );

        if (arrayItemType && arrayItemType.prototype) {
          result[key] = [extractDtoProperties(arrayItemType)];
        } else {
          result[key] = [generatePlaceholder("array")];
        }
      }
      // Handle nested objects
      else if (propertyType && propertyType.prototype) {
        result[key] = extractDtoProperties(propertyType);
      }
      // Handle simple types and enums
      else {
        const placeholder = generatePlaceholder(
          propertyType?.name?.toLowerCase() || "string",
          isEnum
        );

        result[key] = isOptional ? undefined : placeholder;
      }
    } catch (error) {
      console.error(`Error processing property ${key}:`, error);
    }
  });

  return result;
}

async function generateAllDtoJsons(rootPath: string, outputDir: string) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find all DTO files
  const dtoFiles = glob.sync(`${rootPath}/**/*dto.ts`);

  for (const dtoFile of dtoFiles) {
    try {
      // Dynamically import the module
      const module = await import(dtoFile);

      // Find all exported classes ending with Dto
      for (const [exportName, exportValue] of Object.entries(module)) {
        if (
          typeof exportValue === "function" &&
          exportName.endsWith("Dto") &&
          exportValue.prototype
        ) {
          const jsonData = extractDtoProperties(exportValue);

          // Generate output filename
          const moduleName = path.basename(path.dirname(dtoFile));
          const outputFileName = path.join(
            outputDir,
            `${moduleName}-${exportName.toLowerCase()}.json`
          );

          // Write JSON file
          fs.writeFileSync(outputFileName, JSON.stringify(jsonData, null, 2));

          console.log(`Generated JSON for ${exportName} at ${outputFileName}`);
        }
      }
    } catch (error) {
      console.error(`Error processing file ${dtoFile}:`, error);
    }
  }
}

// Main execution
async function main() {
  const rootPath = path.join(__dirname, "..", "src", "modules");
  const outputDir = path.join(__dirname, "generated-jsons.json");

  await generateAllDtoJsons(rootPath, outputDir);
}

// Uncomment to run
main();

export { generateAllDtoJsons };
