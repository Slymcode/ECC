import { IsString, IsNumber, IsEmail } from "class-validator";

export class InitializePaymentDto {
  @IsString()
  orderId: string;

  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;
}

export class VerifyPaymentDto {
  @IsString()
  reference: string;
}
