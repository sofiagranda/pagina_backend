import { Controller, Post, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { VocaliasService } from './vocalias.service';
import { CreateVocaliaDto } from './dto/create-vocalias.dto';
import { UpdateVocaliaDto } from './dto/update-vocalias.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('vocalias')
export class VocaliasController {
  constructor(private readonly vocaliaService: VocaliasService) { }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async crear(@Body() dto: CreateVocaliaDto) {
    return this.vocaliaService.crear(dto);
  }
  
  
  @Get()
  async obtenerTodas() {
    return this.vocaliaService.obtenerTodas();
  }
  
  @Get(':id')
  async obtenerUno(@Param('id') id: string) {
    return this.vocaliaService.obtenerUno(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateVocaliaDto) {
    return this.vocaliaService.actualizar(id, dto);
  }

}
