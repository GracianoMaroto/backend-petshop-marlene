import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { AppointmentServiceType, AppointmentStatus } from './appointment.enums';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID do cliente',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    example: 'd94a0fa8-1f3d-4c4e-8cea-c4e4be5c475f',
    description: 'UUID do pet',
  })
  @IsUUID()
  petId: string;

  @ApiProperty({
    example: AppointmentServiceType.BANHO_E_TOSA,
    enum: AppointmentServiceType,
    description: 'Tipo de serviço solicitado',
  })
  @IsEnum(AppointmentServiceType)
  serviceType: AppointmentServiceType;

  @ApiPropertyOptional({
    example: AppointmentStatus.SCHEDULED,
    enum: AppointmentStatus,
    description: 'Status do agendamento',
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ example: 120.0, description: 'Preço do serviço', minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    example: '2026-06-01T10:00:00Z',
    description: 'Data e hora do serviço em formato ISO 8601',
  })
  @IsDateString()
  serviceDate: string;

  @ApiPropertyOptional({ example: 'Cliente prefere atendimento tranquilo' })
  @IsOptional()
  @IsString()
  notes?: string;
}
