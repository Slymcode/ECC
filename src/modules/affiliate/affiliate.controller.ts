import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
} from "@nestjs/common";
import { AffiliateService } from "./affiliate.service";
import {
  GenerateAffiliateLinkDto,
  WithdrawalRequestDto,
} from "./dto/affiliate.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Affiliate")
@ApiBearerAuth("access-token")
@Controller("affiliate")
export class AffiliateController {
  constructor(private affiliateService: AffiliateService) {}

  @Post("register")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Register as affiliate" })
  async registerAffiliate(@Request() req) {
    return this.affiliateService.registerAffiliate(req.user.id);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get affiliate profile" })
  async getProfile(@Request() req) {
    return this.affiliateService.getAffiliateProfile(req.user.id);
  }

  @Get("dashboard")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get affiliate dashboard with stats" })
  async getDashboard(@Request() req) {
    return this.affiliateService.getAffiliateDashboard(req.user.id);
  }

  @Post("links/generate")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Generate affiliate link for a product" })
  async generateLink(
    @Request() req,
    @Body() generateAffiliateLinkDto: GenerateAffiliateLinkDto,
  ) {
    return this.affiliateService.generateAffiliateLink(
      req.user.id,
      generateAffiliateLinkDto,
    );
  }

  @Get("links/track/:code")
  @ApiOperation({ summary: "Track affiliate link click" })
  async trackClick(@Param("code") code: string) {
    return this.affiliateService.trackAffiliateClick(code);
  }

  @Post("withdrawal/request")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Request withdrawal of earnings" })
  async requestWithdrawal(
    @Request() req,
    @Body() withdrawalRequestDto: WithdrawalRequestDto,
  ) {
    return this.affiliateService.requestWithdrawal(
      req.user.id,
      withdrawalRequestDto,
    );
  }

  @Get("withdrawal/requests")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get withdrawal requests" })
  async getWithdrawals(@Request() req) {
    return this.affiliateService.getWithdrawalRequests(req.user.id);
  }

  @Get("top")
  @ApiOperation({ summary: "Get top affiliates" })
  async getTopAffiliates(@Query("limit") limit = 10) {
    return this.affiliateService.getTopAffiliates(limit);
  }
}
