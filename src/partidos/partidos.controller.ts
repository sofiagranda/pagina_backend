import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';
import { Partido } from './partidos.entity';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) { }

  @Get()
  async findAll(): Promise<Partido[]> {
    return this.partidosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Partido> {
    return this.partidosService.findOne(id);
  }

  @Post('sincronizar-vocalias')
  async sincronizarVocalias() {
    return this.partidosService.sincronizarVocalias();
  }

  @Post()
  async create(@Body() createPartidoDto: CreatePartidoDto): Promise<Partido> {
    return this.partidosService.create(createPartidoDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidoDto: UpdatePartidoDto,
  ): Promise<Partido> {
    return this.partidosService.update(id, updatePartidoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.partidosService.remove(id);
  }
}
