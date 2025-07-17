import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vocalia, VocaliaSchema } from './schemas/vocalias.schema';
import { VocaliasService } from './vocalias.service';
import { VocaliasController } from './vocalias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from 'src/jugadores/jugadores.entity';
import { Estadistica } from 'src/estadisticas/estadisticas.entity';
import { JugadoresModule } from 'src/jugadores/jugadores.module';

@Module({
  imports: [
    // Mongoose entity
    MongooseModule.forFeature([
      { name: Vocalia.name, schema: VocaliaSchema }
    ]),

    // TypeORM entities
    TypeOrmModule.forFeature([
      Jugador,
      Estadistica // 👈 ¡Agregado aquí correctamente!
    ]),

    // Otros módulos necesarios
    JugadoresModule
  ],
  controllers: [VocaliasController],
  providers: [VocaliasService],
  exports: [VocaliasService],
})
export class VocaliasModule {}
