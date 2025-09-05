import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import 'reflect-metadata'
import { AuthPermissionAction } from "@prisma/client"

class CreatePermissionForRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Resource is required' })
  resource!: string;

  @IsEnum(AuthPermissionAction)
  @Transform(({ value }) => value || AuthPermissionAction.View)
  action: AuthPermissionAction = AuthPermissionAction.View;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  description?: string;
}

export default class CreateAuthRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Role name is required' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionForRoleDto)
  @Transform(({ value }) => value || [])
  permissions: CreatePermissionForRoleDto[] = [];
}
