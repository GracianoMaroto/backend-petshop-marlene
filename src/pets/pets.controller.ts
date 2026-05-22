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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pet' })
  @ApiResponse({ status: 201, description: 'Pet criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados de pet inválidos.' })
  create(@Body() data: CreatePetDto) {
    return this.petsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista pets com filtro opcional' })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'UUID do cliente para filtrar pets desse cliente',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca pelo nome ou raça do pet',
  })
  findAll(
    @Query('customerId') customerId?: string,
    @Query('search') search?: string,
  ) {
    return this.petsService.findAll({ customerId, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um pet pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do pet' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um pet' })
  @ApiParam({ name: 'id', description: 'UUID do pet' })
  @ApiResponse({ status: 200, description: 'Pet atualizado com sucesso.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdatePetDto) {
    return this.petsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pet pelo seu ID' })
  @ApiParam({ name: 'id', description: 'UUID do pet' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.remove(id);
  }
}
