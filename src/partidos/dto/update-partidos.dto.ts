// create-partido.dto.ts
import { IsString, IsDateString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdatePartidoDto {
  @IsOptional()
  @IsNumber()
  equipoLocalId?: number;

  @IsOptional()
  @IsNumber()
  equipoVisitanteId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsInt()
  @IsOptional()
  golesLocal?: number;

  @IsInt()
  @IsOptional()
  golesVisitante?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}