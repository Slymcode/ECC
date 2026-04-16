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
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto, UpdateCartItemDto } from "./dto/cart.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Cart")
@ApiBearerAuth("access-token")
@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get user cart" })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post("items")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Add item to cart" })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put("items/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update cart item" })
  async updateCartItem(
    @Param("id") id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(id, updateCartItemDto);
  }

  @Delete("items/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Remove item from cart" })
  async removeFromCart(@Param("id") id: string) {
    return this.cartService.removeFromCart(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Clear entire cart" })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
