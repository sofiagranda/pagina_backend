// create-estadisticas.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateEstadisticaDto {
  @IsNumber()
  equipoId: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  goles_favor?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  goles_contra?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tarjetas_amarillas?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tarjetas_rojas?: number = 0;
}
