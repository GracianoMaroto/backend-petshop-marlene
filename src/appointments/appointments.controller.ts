import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de agendamento inválidos.' })
  create(@Body() data: CreateAppointmentDto) {
    return this.appointmentsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista agendamentos com filtros opcionais' })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'UUID do cliente para filtrar agendamentos',
  })
  @ApiQuery({
    name: 'petId',
    required: false,
    description: 'UUID do pet para filtrar agendamentos',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Data inicial do intervalo YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'Data final do intervalo YYYY-MM-DD',
  })
  findAll(
    @Query('customerId') customerId?: string,
    @Query('petId') petId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appointmentsService.findAll({ customerId, petId, from, to });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um agendamento pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um agendamento existente' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado com sucesso.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um agendamento pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do agendamento' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
