import * as fs from "fs";
import * as path from "path";
import * as pluralize from "pluralize";
import * as ts from "typescript";

interface DtoParseResult {
  fileName: string;
  className: string;
  properties: DtoProperty[];
}

interface DtoProperty {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isEnum: boolean;
  enumValues?: string[];
  isNested: boolean;
  nestedType?: string;
}

class DtoParser {
  private modulesPath: string;
  private parsedEnums: Record<string, string[]> = {};

  constructor(modulesPath: string) {
    this.modulesPath = modulesPath;
  }

  // Find all DTO and Enum files
  findTypeFiles(): { dtoFiles: string[]; enumFiles: string[] } {
    const dtoFiles: string[] = [];
    const enumFiles: string[] = [];

    const traverseDirectory = (dir: string) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          traverseDirectory(fullPath);
        } else if (file.endsWith(".dto.ts") || file.endsWith(".enum.ts")) {
          if (file.endsWith(".dto.ts")) {
            dtoFiles.push(fullPath);
          } else {
            enumFiles.push(fullPath);
          }
        }
      });
    };

    traverseDirectory(this.modulesPath);
    return { dtoFiles, enumFiles };
  }

  // Parse enum files
  parseEnumFiles(enumFiles: string[]) {
    enumFiles.forEach((filePath) => {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const sourceFile = ts.createSourceFile(
        filePath,
        fileContent,
        ts.ScriptTarget.Latest,
        true
      );

      const visit = (node: ts.Node) => {
        if (ts.isEnumDeclaration(node) && node.name) {
          const enumName = node.name.getText();
          const enumValues = node.members
            .filter(ts.isEnumMember)
            .map((member) => member.name.getText().replace(/^['"]|['"]$/g, ""));

          this.parsedEnums[enumName] = enumValues;
        }
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);
    });
  }

  // Parse a single DTO file with deep nesting support
  parseDto(filePath: string): DtoParseResult | null {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      fileContent,
      ts.ScriptTarget.Latest,
      true
    );

    let dtoResult: DtoParseResult | null = null;

    const visit = (node: ts.Node) => {
      if (
        ts.isClassDeclaration(node) &&
        node.name &&
        (node.name.getText().includes("CreateDto") ||
          node.name.getText().includes("Dto"))
      ) {
        const properties: DtoProperty[] = [];

        // Collect class properties with detailed type information
        node.members.forEach((member) => {
          if (ts.isPropertyDeclaration(member)) {
            const propertyDetails = this.extractPropertyDetails(member);
            if (propertyDetails) {
              properties.push(propertyDetails);
            }
          }
        });

        dtoResult = {
          fileName: path.basename(filePath),
          className: node.name.getText(),
          properties,
        };
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return dtoResult;
  }

  // Detailed property type extraction
  private extractPropertyDetails(
    node: ts.PropertyDeclaration
  ): DtoProperty | null {
    const propertyName = node.name.getText();
    const isOptional = node.questionToken !== undefined;

    // Handle type reference (potentially nested or enum)
    if (ts.isTypeReferenceNode(node.type!)) {
      const typeName = node.type.typeName.getText();
      return {
        name: propertyName,
        type: typeName,
        isOptional,
        isArray: false,
        isEnum: Object.keys(this.parsedEnums).includes(typeName),
        enumValues: this.parsedEnums[typeName],
        isNested: true,
        nestedType: typeName,
      };
    }

    // Handle array types
    if (ts.isArrayTypeNode(node.type!)) {
      const elementType = node.type.elementType;

      if (ts.isTypeReferenceNode(elementType)) {
        const typeName = elementType.typeName.getText();
        return {
          name: propertyName,
          type: typeName,
          isOptional,
          isArray: true,
          isEnum: Object.keys(this.parsedEnums).includes(typeName),
          enumValues: this.parsedEnums[typeName],
          isNested: true,
          nestedType: typeName,
        };
      }

      return {
        name: propertyName,
        type: "array",
        isOptional,
        isArray: true,
        isEnum: false,
        isNested: false,
      };
    }

    // Handle primitive types
    return {
      name: propertyName,
      type: node.type ? node.type.getText() : "any",
      isOptional,
      isArray: false,
      isEnum: false,
      isNested: false,
    };
  }

  // Improve file path resolution for nested DTOs
  private findDtoFile(nestedType: string): string | null {
    const normalizedType = nestedType.toLowerCase().replace("dto", "");

    const findFile = (dir: string): string | null => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const result = findFile(fullPath);
          if (result) return result;
        } else if (
          file.toLowerCase().includes(normalizedType) &&
          file.endsWith(".dto.ts")
        ) {
          return fullPath;
        }
      }

      return null;
    };

    return findFile(this.modulesPath);
  }

  // Modify generateSampleJson to use the new file finding method
  generateSampleJson(dto: DtoParseResult, maxDepth: number = 5): any {
    const sampleObj: any = {};
    const processedTypes = new Set<string>();

    const generateValue = (prop: DtoProperty, currentDepth: number): any => {
      // Prevent infinite recursion
      if (currentDepth > maxDepth) return null;

      // Enum handling
      if (prop.isEnum && prop.enumValues && prop.enumValues.length > 0) {
        return prop.enumValues[0];
      }

      // Nested object handling
      if (prop.isNested && prop.nestedType) {
        // Prevent circular references
        if (processedTypes.has(prop.nestedType)) return {};
        processedTypes.add(prop.nestedType);

        // Find the nested DTO file
        const nestedDtoPath = this.findDtoFile(prop.nestedType);

        if (nestedDtoPath) {
          const nestedDto = this.parseDto(nestedDtoPath);

          if (nestedDto) {
            if (prop.isArray) {
              return [this.generateSampleJson(nestedDto, currentDepth + 1)];
            }
            return this.generateSampleJson(nestedDto, currentDepth + 1);
          }
        }
        return {};
      }

      // Primitive type handling
      switch (prop.type) {
        case "string":
          return "";
        case "number":
          return 0;
        case "boolean":
          return false;
        case "array":
          return [];
        default:
          return null;
      }
    };

    dto.properties.forEach((prop) => {
      // Only add non-optional properties or properties with a default value
      if (!prop.isOptional) {
        sampleObj[prop.name] = generateValue(prop, 0);
      }
    });

    return sampleObj;
  }

  // Main method to parse all DTOs
  parseAllDtos(): Record<string, any> {
    // First, parse enum files
    const { dtoFiles, enumFiles } = this.findTypeFiles();
    this.parseEnumFiles(enumFiles);

    // Then parse DTOs
    const parsedDtos: Record<string, any> = {};

    dtoFiles.forEach((file) => {
      const parsedDto = this.parseDto(file);
      if (parsedDto) {
        const resourceName = pluralize.singular(
          parsedDto.fileName.replace(".dto.ts", "")
        );
        parsedDtos[resourceName] = this.generateSampleJson(parsedDto);
      }
    });

    return parsedDtos;
  }
}

export default DtoParser;
