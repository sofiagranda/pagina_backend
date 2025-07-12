import { Module } from '@nestjs/common';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estadistica } from './estadisticas.entity';
import { Equipo } from 'src/equipos/equipos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estadistica, Equipo])],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
  exports: [EstadisticasService],
})
export class EstadisticasModule {}

