// create-partido.dto.ts
import { IsString, IsDateString, IsInt, IsOptional } from 'class-validator';

export class UpdatePartidoDto {
  @IsString()
  equipoLocal?: string;

  @IsString()
  equipoVisitante?: string;

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
