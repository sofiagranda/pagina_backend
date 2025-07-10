import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateEquipoDto {
  @IsString()
  nombre: string; // Nombre del equipo, obligatorio

  @IsInt()
  fundacion: number;  // Año de fundación del equipo

  @IsString()
  foto: string;  // Nombre del archivo de la imagen
}
