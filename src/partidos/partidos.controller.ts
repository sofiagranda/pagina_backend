import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';
import { Partido } from './partidos.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('sincronizar-vocalias')
  async sincronizarVocalias() {
    return this.partidosService.sincronizarVocalias();
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPartidoDto: CreatePartidoDto): Promise<Partido> {
    return this.partidosService.create(createPartidoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidoDto: UpdatePartidoDto,
  ): Promise<Partido> {
    return this.partidosService.update(id, updatePartidoDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const partidoId = parseInt(id, 10);
    await this.partidosService.eliminarPartido(partidoId);
    return { message: 'Partido y vocalía eliminados correctamente' };
  }
}

