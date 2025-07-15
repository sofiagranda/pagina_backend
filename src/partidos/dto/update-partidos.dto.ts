// create-partido.dto.ts
import { IsString, IsDateString, IsInt, IsOptional, IsNumber } from 'class-validator';

export class UpdatePartidoDto {
  @IsNumber()
  equipoLocalId?: number;

  @IsNumber()
  equipoVisitanteId?: number;

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