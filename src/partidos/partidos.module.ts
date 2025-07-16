import { forwardRef, Module } from '@nestjs/common';
import { PartidosController } from './partidos.controller';
import { PartidosService } from './partidos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './partidos.entity';
import { Estadistica } from 'src/estadisticas/estadisticas.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocalia, VocaliaSchema } from 'src/vocalias/schemas/vocalias.schema';
import { VocaliasModule } from 'src/vocalias/vocalias.module';
import { EstadisticasModule } from 'src/estadisticas/estadisticas.module';
import { TablaPosicionesModule } from 'src/tablaPosiciones/tabla-posiciones.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Partido, Estadistica]),
    MongooseModule.forFeature([{ name: Vocalia.name, schema: VocaliaSchema }]),
    forwardRef(() => VocaliasModule),
    forwardRef(() => TablaPosicionesModule),
    forwardRef(() => EstadisticasModule),
  ],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService],
})
export class PartidosModule { }

