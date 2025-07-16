// create-partido.dto.ts
import { IsString, IsDateString, IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { EstadoPartido } from '../partidos.entity';

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

  @IsOptional()
  @IsEnum(EstadoPartido, { message: 'Estado debe ser pendiente o completo' })
  estado: EstadoPartido;
}