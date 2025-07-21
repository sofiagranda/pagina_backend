import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { TablaPosicionesService } from './tabla-posiciones.service';
import { CreateTablaPosicionDto } from './dto/create-tabla-posicion.dto';
import { UpdateTablaPosicionDto } from './dto/update-tabla-posiciom.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tabla-posiciones')
export class TablaPosicionesController {
    constructor(private readonly tablaService: TablaPosicionesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async crear(@Body() dto: CreateTablaPosicionDto) {
        return this.tablaService.crearRegistro(dto);
    }

    @Get()
    async obtener() {
        return this.tablaService.obtenerTodos();
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async actualizar(
        @Param('id') id: string,
        @Body() dto: UpdateTablaPosicionDto
    ) {
        return this.tablaService.actualizarRegistro(id, dto);
    }
}
