import { Module } from '@nestjs/common';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './partidos.entity';
import { Estadistica } from 'src/estadisticas/estadisticas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Estadistica])],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService],
})
export class PartidosModule {}

