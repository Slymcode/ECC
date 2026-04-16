import { IsNumber, IsString, IsOptional, Min, Max } from "class-validator";

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  productId: string;
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewResponseDto {
  id: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
