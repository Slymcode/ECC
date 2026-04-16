import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserProfileDto, AddAddressDto } from "./dto/user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        customer: true,
        affiliate: true,
      },
    });
  }

  async updateUserProfile(userId: string, data: UpdateUserProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });
  }

  async getUserAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async addAddress(userId: string, addressData: AddAddressDto) {
    return this.prisma.address.create({
      data: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode,
        isDefault: addressData.isDefault || false,
        userId,
      },
    });
  }
}
