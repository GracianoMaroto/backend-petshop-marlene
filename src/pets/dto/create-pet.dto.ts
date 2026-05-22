import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsUUID()
  customerId: string;
}
