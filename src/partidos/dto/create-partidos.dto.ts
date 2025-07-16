// create-partido.dto.ts
import { IsString, IsDateString, IsInt, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { EstadoPartido } from '../partidos.entity';

export class CreatePartidoDto {
  @IsNumber()
  equipoLocalId: number;

  @IsNumber()
  equipoVisitanteId: number;

  @IsDateString()
  fecha: string;

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
