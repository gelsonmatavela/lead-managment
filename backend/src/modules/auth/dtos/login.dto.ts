import { IsString, MinLength, Matches, IsObject, IsOptional } from 'class-validator'
import "reflect-metadata"

export default class LoginDto {
  @IsString()
  email!: string

  @IsString()
  @IsString()
  @IsOptional()
  companyCode?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  password!: string
}
