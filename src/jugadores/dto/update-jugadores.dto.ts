// src/jugadores/dto/create-jugador.dto.ts
import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateJugadorDto {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  posicion: string;
  
  @IsOptional()
  @IsNumber()
  edad: number;
  
  @IsOptional()
  @IsString()
  pais: string;

  @IsOptional()
  @IsNumber()
  equipoId: number;

  @IsOptional()
  @IsString()
  foto?: string;
  
  @IsOptional()
  @Column({ default: true })
  isActive: boolean;

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
