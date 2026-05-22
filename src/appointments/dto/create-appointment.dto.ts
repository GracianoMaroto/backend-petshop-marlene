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
  @IsUUID()
  customerId: string;

  @IsUUID()
  petId: string;

  @IsEnum(AppointmentServiceType)
  serviceType: AppointmentServiceType;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsDateString()
  serviceDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
