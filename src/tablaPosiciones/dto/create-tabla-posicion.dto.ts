import { IsMongoId, IsNumber } from 'class-validator';

export class CreateTablaPosicionDto {
  @IsNumber()
  equipoId: number;

  @IsNumber()
  puntos: number;

  @IsNumber()
  partidosJugados: number;

  @IsNumber()
  partidosGanados: number;

  @IsNumber()
  partidosEmpatados: number;

  @IsNumber()
  partidosPerdidos: number;

  @IsNumber()
  golesFavor: number;

  @IsNumber()
  golesContra: number;

  @IsNumber()
  diferenciaGol: number;
}
