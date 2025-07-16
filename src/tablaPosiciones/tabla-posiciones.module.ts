import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TablaPosiciones, TablaPosicionesSchema } from './schema/tabla-posiciones.schema';
import { TablaPosicionesService } from './tabla-posiciones.service';
import { TablaPosicionesController } from './tabla-posiciones.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TablaPosiciones.name, schema: TablaPosicionesSchema }])
  ],
  controllers: [TablaPosicionesController],
  providers: [TablaPosicionesService],
  exports: [TablaPosicionesService],
})
export class TablaPosicionesModule { }
