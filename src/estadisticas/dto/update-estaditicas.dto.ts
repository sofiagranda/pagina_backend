import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class UpdateEstadisticaDto {
  @IsUUID()
  @IsNotEmpty()
  jugadorId?: string;

  @IsNumber()
  @IsPositive()
  goles?: number;

  @IsNumber()
  @IsPositive()
  asistencias?: number;
}
