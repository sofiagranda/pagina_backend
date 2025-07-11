// src/jugadores/dto/create-jugador.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateJugadorDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  posicion: string;

  @IsNumber()
  edad: number;

  @IsString()
  pais: string;

  @IsNumber()
  equipoId: number;

  @IsOptional()
  @IsString()
  foto?: string;
}

