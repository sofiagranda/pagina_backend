// En partidos.controller.ts
import { Controller, Post, Put, Body, Param, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { PartidosService, Partido } from './partidos.service'; 
import { CreatePartidoDto } from './dto/create-partidos.dto';
import { UpdatePartidoDto } from './dto/update-partidos.dto';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Post()
  create(@Body() createPartidoDto: CreatePartidoDto): Partido { // 
    return this.partidosService.create(createPartidoDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidoDto: UpdatePartidoDto,
  ): Partido { // 👈 tipo de retorno
    return this.partidosService.update(id, updatePartidoDto);
  }

  @Get()
  findAll(): Partido[] { // 👈 tipo de retorno
    return this.partidosService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) { 
    return this.partidosService.remove(+id);
  }
}
