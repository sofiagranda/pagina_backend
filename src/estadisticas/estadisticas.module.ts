import { Module } from '@nestjs/common';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estadistica } from './estadisticas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estadistica])],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
  exports: [EstadisticasService],
})
export class EstadisticasModule {}

