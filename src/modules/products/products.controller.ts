import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { Roles, RolesGuard } from "../auth/roles.guard";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "Get all products with filters" })
  async getProducts(@Query() filters: any) {
    return this.productsService.getProducts(filters);
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured products" })
  async getFeaturedProducts(@Query("limit") limit = 10) {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get("category/:category")
  @ApiOperation({ summary: "Get products by category" })
  async getByCategory(@Param("category") category: string) {
    return this.productsService.getProductsByCategory(category);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get product by slug" })
  async getBySlug(@Param("slug") slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @ApiOperation({ summary: "Create product (Admin only)" })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @ApiOperation({ summary: "Update product (Admin only)" })
  async updateProduct(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @ApiOperation({ summary: "Delete product (Admin only)" })
  async deleteProduct(@Param("id") id: string) {
    return this.productsService.deleteProduct(id);
  }
}
