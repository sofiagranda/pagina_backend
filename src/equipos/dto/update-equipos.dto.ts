import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateEquipoDto {
  @IsString()
  @IsOptional()  // La propiedad "nombre" es opcional para actualización
  nombre?: string; // Nombre del equipo (opcional)

  @IsInt()
  @IsOptional()  // La propiedad "fundacion" es opcional para actualización
  fundacion?: number;  // Año de fundación del equipo (opcional)

  @IsString()
  @IsOptional()  // La propiedad "foto" es opcional para actualización
  foto?: string;  // Nombre del archivo de la imagen (opcional)
}
