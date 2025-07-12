import { Module } from '@nestjs/common';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './equipos.entity';
import { EstadisticasModule } from 'src/estadisticas/estadisticas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo]),
    EstadisticasModule],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule { }
