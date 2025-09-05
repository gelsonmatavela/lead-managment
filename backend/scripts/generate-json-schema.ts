import { Type } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
  getMetadataStorage,
} from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

class AddressDto {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  zipCode!: string;
}

class UserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age!: number;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}

function generateJsonSchema(classes: any[]) {
  const metadataStorage = getMetadataStorage();

  // // This will load metadata for the classes
  // [UserDto, AddressDto].forEach((targetClass) => {
  //   metadataStorage.addValidationMetadata(targetClass);
  // });

  const schemas = validationMetadatasToSchemas({
    classValidatorMetadataStorage: metadataStorage,
    classTransformerMetadataStorage: undefined,
    refPointerPrefix: "#/components/schemas/",
  });

  return schemas;
}

function generateJsonSample(schema: any): any {
  const generateSample = (propertySchema: any): any => {
    if (propertySchema.type === "string") {
      if (propertySchema.format === "email") return "johndoe@example.com";
      return propertySchema.enum ? propertySchema.enum[0] : "Sample String";
    }
    if (propertySchema.type === "integer") {
      return propertySchema.minimum || 18;
    }
    if (propertySchema.type === "object" && propertySchema.properties) {
      const objectSample: any = {};
      Object.keys(propertySchema.properties).forEach((key) => {
        objectSample[key] = generateSample(propertySchema.properties[key]);
      });
      return objectSample;
    }
    return null;
  };

  return generateSample(schema.UserDto);
}

// Generate and log JSON Schema
const jsonSchemas = generateJsonSchema([]);
console.log("JSON Schema:", JSON.stringify(jsonSchemas, null, 2));

// Generate JSON Sample
const jsonSample = generateJsonSample(jsonSchemas);
console.log("JSON Sample:", JSON.stringify(jsonSample, null, 2));
