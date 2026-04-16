import {
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class CreateAdminDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class SetCommissionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}

export class AdminResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}
