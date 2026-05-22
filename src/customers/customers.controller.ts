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
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de cliente inválidos.' })
  create(@Body() data: CreateCustomerDto) {
    return this.customersService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista clientes com filtro opcional' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca no nome ou telefone do cliente',
  })
  findAll(@Query('search') search?: string) {
    return this.customersService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um cliente pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cliente pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
