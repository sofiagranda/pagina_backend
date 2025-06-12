// create-estadisticas.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateEstadisticaDto {
  @IsInt()
  jugadorId: number;

  @IsInt()
  @Min(0)
  goles: number;

  @IsInt()
  @Min(0)
  asistencias: number;
}
