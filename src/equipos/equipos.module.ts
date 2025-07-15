import { Module } from '@nestjs/common';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './equipos.entity';
import { EstadisticasModule } from 'src/estadisticas/estadisticas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TablaPosiciones, TablaPosicionesSchema } from 'src/tablaPosiciones/schema/tabla-posiciones.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipo]),
    EstadisticasModule,
    MongooseModule.forFeature([
      { name: TablaPosiciones.name, schema: TablaPosicionesSchema },
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule {}
