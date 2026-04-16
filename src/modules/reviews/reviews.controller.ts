import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto, UpdateReviewDto } from "./dto/review.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Create a new product review" })
  async createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, createReviewDto);
  }

  @Get("product/:productId")
  @ApiOperation({ summary: "Get reviews for a product" })
  async getProductReviews(
    @Param("productId") productId: string,
    @Query("skip") skip = 0,
    @Query("take") take = 10,
  ) {
    return this.reviewsService.getProductReviews(productId, skip, take);
  }

  @Get("can-review/:productId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Check if the current user can review a product" })
  async canReviewProduct(
    @Request() req,
    @Param("productId") productId: string,
  ) {
    return {
      canReview: await this.reviewsService.canReviewProduct(
        req.user.id,
        productId,
      ),
    };
  }

  @Get("user")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get current user's reviews" })
  async getUserReviews(@Request() req) {
    return this.reviewsService.getUserReviews(req.user.id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Update a review" })
  async updateReview(
    @Request() req,
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, req.user.id, updateReviewDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Delete a review" })
  async deleteReview(@Request() req, @Param("id") id: string) {
    return this.reviewsService.deleteReview(id, req.user.id);
  }
}
