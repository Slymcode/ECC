import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  GenerateAffiliateLinkDto,
  WithdrawalRequestDto,
} from "./dto/affiliate.dto";

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  async registerAffiliate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { affiliate: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.affiliate) {
      throw new ConflictException("User is already registered as an affiliate");
    }

    // Generate unique affiliate code
    const code = `AFF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const affiliate = await this.prisma.affiliate.create({
      data: {
        userId,
        code,
      },
    });

    // Update user role to AFFILIATE
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: "AFFILIATE" },
    });

    return affiliate;
  }

  async getAffiliateProfile(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        affiliateLinks: { include: { product: true } },
        commissions: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException("Affiliate profile not found");
    }

    return affiliate;
  }

  async generateAffiliateLink(
    userId: string,
    generateAffiliateLinkDto: GenerateAffiliateLinkDto,
  ) {
    const { productId } = generateAffiliateLinkDto;

    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException("Affiliate not registered");
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Check if link already exists
    const existingLink = await this.prisma.affiliateLink.findUnique({
      where: {
        affiliateId_productId: { affiliateId: affiliate.id, productId },
      },
    });

    if (existingLink) {
      return existingLink;
    }

    const code = `${affiliate.code}-${product.slug}`;

    return this.prisma.affiliateLink.create({
      data: {
        affiliateId: affiliate.id,
        productId,
        code,
      },
    });
  }

  async getAffiliateDashboard(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        affiliateLinks: { include: { product: true } },
        commissions: true,
        referrals: { include: { order: true } },
        withdrawals: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException("Affiliate not found");
    }

    // Calculate stats
    const totalClicks = affiliate.affiliateLinks.reduce(
      (sum, link) => sum + link.clicks,
      0,
    );
    const totalConversions = affiliate.referrals.length;
    const totalEarnings = affiliate.commissions
      .filter((c) => c.status === "APPROVED" || c.status === "PAID")
      .reduce((sum, c) => sum + c.amount, 0);
    const availableEarnings = affiliate.commissions
      .filter((c) => c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amount, 0);
    const pendingEarnings = affiliate.commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      affiliate,
      stats: {
        totalClicks,
        totalConversions,
        totalEarnings,
        availableEarnings,
        pendingEarnings,
        conversionRate:
          totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      },
      links: affiliate.affiliateLinks,
      recentReferrals: affiliate.referrals.slice(0, 10),
    };
  }

  async trackAffiliateClick(affiliateCode: string) {
    const link = await this.prisma.affiliateLink.findUnique({
      where: { code: affiliateCode },
    });

    if (link) {
      await this.prisma.affiliateLink.update({
        where: { code: affiliateCode },
        data: { clicks: link.clicks + 1 },
      });
    }

    return link;
  }

  async requestWithdrawal(
    userId: string,
    withdrawalRequestDto: WithdrawalRequestDto,
  ) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException("Affiliate not found");
    }

    // Calculate approved earnings available for withdrawal
    const approvedCommissions = await this.prisma.commission.findMany({
      where: {
        affiliateId: affiliate.id,
        status: "APPROVED",
      },
    });

    const totalApproved = approvedCommissions.reduce(
      (sum, c) => sum + c.amount,
      0,
    );

    const outstandingRequests = await this.prisma.withdrawalRequest.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
      _sum: {
        amount: true,
      },
    });

    const reservedAmount = outstandingRequests._sum.amount || 0;
    const availableAmount = totalApproved - reservedAmount;

    if (withdrawalRequestDto.amount > availableAmount) {
      throw new BadRequestException(
        "Insufficient approved earnings available for withdrawal",
      );
    }

    return this.prisma.withdrawalRequest.create({
      data: {
        userId,
        affiliateId: affiliate.id,
        amount: withdrawalRequestDto.amount,
        bankName: withdrawalRequestDto.bankName,
        accountNumber: withdrawalRequestDto.accountNumber,
        accountHolder: withdrawalRequestDto.accountHolder,
      },
    });
  }

  async getWithdrawalRequests(userId: string) {
    return this.prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTopAffiliates(limit = 10) {
    const affiliates = await this.prisma.affiliate.findMany({
      take: limit,
      orderBy: { totalEarnings: "desc" },
      include: { user: true, referrals: true, commissions: true },
    });

    return affiliates.map((aff) => ({
      ...aff,
      totalReferrals: aff.referrals.length,
    }));
  }
}
