import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { CreateEstadisticaDto } from './dto/create-estadisticas.dto';
import { UpdateEstadisticaDto } from './dto/update-estaditicas.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Estadistica } from './estadisticas.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) { }

  @Post('inicializar')
  async inicializar() {
    await this.estadisticasService.inicializarEstadisticasParaEquiposExistentes();
    return { message: 'Estadísticas inicializadas para equipos existentes' };
  }

  @Post()
  async create(@Body() dto: CreateEstadisticaDto) {
    const item = await this.estadisticasService.create(dto);
    return new SuccessResponseDto('Estadística creada exitosamente', item);
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<SuccessResponseDto<Pagination<Estadistica>>> {
    const result = await this.estadisticasService.findAll({ page, limit });
    return new SuccessResponseDto('Estadísticas recuperadas exitosamente', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.estadisticasService.findOne(id);
    if (!item) throw new NotFoundException('Estadística no encontrada');
    return new SuccessResponseDto('Estadística recuperada exitosamente', item);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEstadisticaDto) {
    const item = await this.estadisticasService.update(id, dto);
    if (!item) throw new NotFoundException('Estadística no encontrada');
    return new SuccessResponseDto('Estadística actualizada exitosamente', item);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const item = await this.estadisticasService.remove(id);
    if (!item) throw new NotFoundException('Estadística no encontrada');
    return new SuccessResponseDto('Estadística eliminada exitosamente', item);
  }
}
