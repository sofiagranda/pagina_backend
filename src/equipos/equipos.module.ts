import { Module } from '@nestjs/common';
import { EquiposController } from './equipos.controller';
import { EquiposService } from './equipos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './equipos.entity';
import { EstadisticasModule } from 'src/estadisticas/estadisticas.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TablaPosiciones, TablaPosicionesSchema } from 'src/tablaPosiciones/schema/tabla-posiciones.schema';
import { Vocalia, VocaliaSchema } from 'src/vocalias/schemas/vocalias.schema';

// 👇 Asegúrate de importar estas entidades
import { Jugador } from '../jugadores/jugadores.entity';
import { Estadistica } from '../estadisticas/estadisticas.entity';
import { Partido } from '../partidos/partidos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipo,
      Jugador,
      Estadistica,
      Partido,
    ]),
    EstadisticasModule,
    MongooseModule.forFeature([
      { name: TablaPosiciones.name, schema: TablaPosicionesSchema },
      { name: Vocalia.name, schema: VocaliaSchema },
    ]),
  ],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule {}
