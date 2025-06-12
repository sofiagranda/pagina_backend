import { IsNotEmpty, IsString } from "class-validator";


export class UpdateEquipoDto {
  @IsNotEmpty()
  @IsString()
  nombre?: string;
}