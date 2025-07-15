import { Module } from '@nestjs/common';
import { JugadoresController } from './jugadores.controller';
import { JugadoresService } from './jugadores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jugador } from './jugadores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jugador])],
  controllers: [JugadoresController],
  providers: [JugadoresService],
  exports: [JugadoresService, TypeOrmModule],
})
export class JugadoresModule {}

