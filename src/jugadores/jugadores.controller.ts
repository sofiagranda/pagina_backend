import {
    Controller, Get, Post, Put, Delete, Body, Param,
    Query, BadRequestException, NotFoundException,
    UseInterceptors, UploadedFile,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { JugadoresService } from './jugadores.service';
  import { CreateJugadorDto } from './dto/create-jugadores.dto';
  import { UpdateJugadorDto } from './dto/update-jugadores.dto';
  import { SuccessResponseDto } from 'src/common/dto/response.dto';
  import { Pagination } from 'nestjs-typeorm-paginate';
  import { Jugador } from './jugadores.entity';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  
  @Controller('jugadores')
  export class JugadoresController {
    constructor(private readonly jugadoresService: JugadoresService) {}
  
    @Post()
    async create(@Body() dto: CreateJugadorDto) {
      const jugador = await this.jugadoresService.create(dto);
      return new SuccessResponseDto('Jugador creado correctamente', jugador);
    }
  
    @Get()
    async findAll(
      @Query('page') page = 1,
      @Query('limit') limit = 100,
      @Query('isActive') isActive?: string,
    ): Promise<SuccessResponseDto<Pagination<Jugador>>> {
      if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
        throw new BadRequestException('El valor de "isActive" debe ser "true" o "false"');
      }
      const result = await this.jugadoresService.findAll({ page, limit }, isActive === 'true' || isActive === 'false' ? isActive === 'true' : undefined);
      if (!result) throw new InternalServerErrorException('No se pudieron recuperar los jugadores');
      return new SuccessResponseDto('Jugadores recuperados correctamente', result);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number) {
      const jugador = await this.jugadoresService.findOne(+id);
      if (!jugador) throw new NotFoundException('Jugador no encontrado');
      return new SuccessResponseDto('Jugador recuperado correctamente', jugador);
    }
  
    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateJugadorDto) {
      const jugador = await this.jugadoresService.update(+id, dto);
      if (!jugador) throw new NotFoundException('Jugador no encontrado');
      return new SuccessResponseDto('Jugador actualizado correctamente', jugador);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: number) {
      const jugador = await this.jugadoresService.remove(+id);
      if (!jugador) throw new NotFoundException('Jugador no encontrado');
      return new SuccessResponseDto('Jugador eliminado correctamente', jugador);
    }
  
    @Put(':id/foto')
    @UseInterceptors(FileInterceptor('foto', {
      storage: diskStorage({
        destination: './public/fotos',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Solo se permiten archivos JPG o PNG'), false);
        }
        cb(null, true);
      },
    }))
    async uploadFoto(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
      if (!file) throw new BadRequestException('La imagen es requerida');
      const jugador = await this.jugadoresService.updateFoto(+id, file.filename);
      if (!jugador) throw new NotFoundException('Jugador no encontrado');
      return new SuccessResponseDto('Foto actualizada correctamente', jugador);
    }
  }
  