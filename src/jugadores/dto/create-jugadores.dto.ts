// src/jugadores/dto/create-jugador.dto.ts
import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

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

  @IsOptional()
  @IsInt()
  @Min(0)
  goles?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  tarjetasAmarillas?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  tarjetasRojas?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  partidosJugados?: number;
}

