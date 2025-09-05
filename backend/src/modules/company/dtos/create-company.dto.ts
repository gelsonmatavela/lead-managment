import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import CreateAddressDto from "../../address/dtos/create-address.dto";

export default class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    logo!: string;

    @IsArray()
    @IsOptional()
    leaders?: string[];

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    phone1!: string;

    @IsString()
    @IsOptional()
    phone2!: string;

    @IsNotEmpty()
    address!: CreateAddressDto;
}