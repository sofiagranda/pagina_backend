import {
    Controller, Get, Post, Put, Delete, Param, Body, Query,
    NotFoundException, BadRequestException, InternalServerErrorException
  } from '@nestjs/common';
  import { EquiposService } from './equipos.service';
  import { CreateEquipoDto } from './dto/create-equipos.dto';
  import { UpdateEquipoDto } from './dto/update-equipos.dto';
  import { SuccessResponseDto } from 'src/common/dto/response.dto';
  import { Equipo } from './equipos.entity';
  import { Pagination } from 'nestjs-typeorm-paginate';
  
  @Controller('equipos')
  export class EquiposController {
    constructor(private readonly equiposService: EquiposService) {}
  
    @Post()
    async create(@Body() dto: CreateEquipoDto) {
      const equipo = await this.equiposService.create(dto);
      return new SuccessResponseDto('Equipo creado correctamente', equipo);
    }
  
    @Get()
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<SuccessResponseDto<Pagination<Equipo>>> {
      const result = await this.equiposService.findAll({ page, limit });
      if (!result) throw new InternalServerErrorException('Error al obtener equipos');
      return new SuccessResponseDto('Equipos obtenidos correctamente', result);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      const equipo = await this.equiposService.findOne(id);
      if (!equipo) throw new NotFoundException('Equipo no encontrado');
      return new SuccessResponseDto('Equipo encontrado', equipo);
    }
  
    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateEquipoDto) {
      const equipo = await this.equiposService.update(id, dto);
      if (!equipo) throw new NotFoundException('Equipo no encontrado');
      return new SuccessResponseDto('Equipo actualizado correctamente', equipo);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number) {
      const equipo = await this.equiposService.remove(id);
      if (!equipo) throw new NotFoundException('Equipo no encontrado');
      return new SuccessResponseDto('Equipo eliminado correctamente', equipo);
    }
  }
  