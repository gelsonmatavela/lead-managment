import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class CreateAddressDto{
    @IsString()
    @IsNotEmpty()
    country!: string;

    @IsString()
    @IsNotEmpty()
    state!: string;

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsOptional()
    neighborhood?: string;

    @IsString()
    @IsOptional()
    street?: string;
}