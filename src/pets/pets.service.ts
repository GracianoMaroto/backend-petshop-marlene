import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

type FindPetsParams = {
  customerId?: string;
  search?: string;
};

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePetDto) {
    await this.ensureCustomerExists(data.customerId);
    return this.prisma.pet.create({ data });
  }

  findAll(params: FindPetsParams) {
    const where: Prisma.PetWhereInput = {};

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { breed: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.pet.findMany({
      where,
      include: { customer: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        customer: true,
        appointments: { orderBy: { serviceDate: 'desc' } },
      },
    });

    if (!pet) {
      throw new NotFoundException('Animal não encontrado.');
    }

    return pet;
  }

  async update(id: string, data: UpdatePetDto) {
    await this.findOne(id);

    if (data.customerId) {
      await this.ensureCustomerExists(data.customerId);
    }

    return this.prisma.pet.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pet.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureCustomerExists(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }
  }
}
