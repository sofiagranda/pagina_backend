import { IsOptional, IsNumber, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NominaDto {
  @IsNumber()
  @IsOptional()
  jugadorId?: number;

  @IsNumber()
  @IsOptional()
  equipoId?: number;

  @IsBoolean()
  @IsOptional()
  jugo?: boolean;
}

class GoleadorDto {
  @IsNumber()
  @IsOptional()
  jugadorId?: number;

  @IsNumber()
  @IsOptional()
  numeroGoles?: number;
}

class TarjetaDto {
  @IsNumber()
  @IsOptional()
  jugadorId?: number;

  @IsNumber()
  @IsOptional()
  equipoId?: number;
}

export class UpdateVocaliaDto {
  @IsOptional()
  @IsNumber()
  partidoId?: number;

  @IsOptional()
  @IsNumber()
  equipoLocalId?: number;

  @IsOptional()
  @IsNumber()
  equipoVisitanteId?: number;

  @IsOptional()
  @IsNumber()
  golesLocal?: number;

  @IsOptional()
  @IsNumber()
  golesVisita?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NominaDto)
  nominaLocal?: NominaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NominaDto)
  nominaVisitante?: NominaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoleadorDto)
  goleadoresLocal?: GoleadorDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoleadorDto)
  goleadoresVisita?: GoleadorDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TarjetaDto)
  tarjetasAmarillas?: TarjetaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TarjetaDto)
  tarjetasRojas?: TarjetaDto[];
}
