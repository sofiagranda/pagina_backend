import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class UpdateTablaPosicionDto {
  @IsNumber()
  @IsOptional()
  equipoId?: number;
  
  @IsOptional()
  @IsNumber()
  puntos?: number;
  
  @IsOptional()
  @IsNumber()
  partidosJugados?: number;
  
  @IsOptional()
  @IsNumber()
  partidosGanados?: number;

  @IsOptional()
  @IsNumber()
  partidosEmpatados?: number;
  
  @IsOptional()
  @IsNumber()
  partidosPerdidos?: number;
  
  @IsOptional()
  @IsNumber()
  golesFavor?: number;
  
  @IsOptional()
  @IsNumber()
  golesContra?: number;
  
  @IsOptional()
  @IsNumber()
  diferenciaGol?: number;
}
