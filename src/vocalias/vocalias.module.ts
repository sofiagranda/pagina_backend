import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocalia, VocaliaSchema } from './schemas/vocalias.schema';
import { VocaliasService } from './vocalias.service';
import { VocaliasController } from './vocalias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from 'src/jugadores/jugadores.entity';
import { JugadoresModule } from 'src/jugadores/jugadores.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocalia.name, schema: VocaliaSchema }
    ]),
    TypeOrmModule.forFeature([Jugador]), // <- IMPORTANTE
    JugadoresModule, // <- también si usas JugadoresService u otro proveedor
  ], controllers: [VocaliasController],
  providers: [VocaliasService],
  exports: [VocaliasService],
})
export class VocaliasModule { }
