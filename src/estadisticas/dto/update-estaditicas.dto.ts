// create-estadisticas.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateEstadisticaDto {
  @IsNumber()
  @IsOptional()
  equipoId: number;
  
  @IsNumber()
  @IsOptional()
  @Min(0)
  golesFavor?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  golesContra?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tarjetas_amarillas?: number = 0;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tarjetas_rojas?: number = 0;
}
