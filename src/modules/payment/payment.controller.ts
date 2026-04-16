import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { InitializePaymentDto, VerifyPaymentDto } from "./dto/payment.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Payment")
@ApiBearerAuth("access-token")
@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("initialize")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Initialize Paystack payment" })
  async initializePayment(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentService.initializePayment(initializePaymentDto);
  }

  @Post("verify")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Verify Paystack payment" })
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(verifyPaymentDto);
  }

  @Get("history")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get payment history" })
  async getPaymentHistory(
    @Request() req,
    @Query("skip") skip = 0,
    @Query("take") take = 10,
  ) {
    return this.paymentService.getPaymentHistory(req.user.id, skip, take);
  }
}
