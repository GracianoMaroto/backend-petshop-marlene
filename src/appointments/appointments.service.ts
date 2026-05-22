import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

type FindAppointmentsParams = {
  customerId?: string;
  petId?: string;
  from?: string;
  to?: string;
};

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto) {
    await this.ensureCustomerAndPetMatch(data.customerId, data.petId);

    return this.prisma.appointment.create({
      data: {
        ...data,
        serviceDate: new Date(data.serviceDate),
      },
      include: this.defaultInclude(),
    });
  }

  findAll(params: FindAppointmentsParams) {
    const where: Prisma.AppointmentWhereInput = {};

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    if (params.petId) {
      where.petId = params.petId;
    }

    if (params.from || params.to) {
      where.serviceDate = {
        gte: params.from ? new Date(params.from) : undefined,
        lte: params.to ? new Date(params.to) : undefined,
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: this.defaultInclude(),
      orderBy: { serviceDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });

    if (!appointment) {
      throw new NotFoundException('Atendimento não encontrado.');
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDto) {
    const current = await this.findOne(id);
    const nextCustomerId = data.customerId ?? current.customerId;
    const nextPetId = data.petId ?? current.petId;

    await this.ensureCustomerAndPetMatch(nextCustomerId, nextPetId);

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        serviceDate: data.serviceDate ? new Date(data.serviceDate) : undefined,
      },
      include: this.defaultInclude(),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.appointment.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureCustomerAndPetMatch(customerId: string, petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true, customerId: true },
    });

    if (!pet) {
      throw new NotFoundException('Animal não encontrado.');
    }

    if (pet.customerId !== customerId) {
      throw new BadRequestException(
        'O animal selecionado não pertence ao cliente.',
      );
    }
  }

  private defaultInclude() {
    return {
      customer: true,
      pet: true,
    } satisfies Prisma.AppointmentInclude;
  }
}
