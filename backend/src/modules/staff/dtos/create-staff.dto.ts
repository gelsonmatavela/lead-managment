import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class CompanyConnectDto {
    @IsString()
    @IsNotEmpty()
    id!: string
}

export class CompanyConnectionDto {
    @ValidateNested()
    @Type(() => CompanyConnectDto)
    company!: CompanyConnectDto
}


export class CreaStaffWithCompany {
    @IsString()
    @IsNotEmpty()
    companyCode!: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(()=> CompanyConnectionDto)
    company!: CompanyConnectionDto;
}