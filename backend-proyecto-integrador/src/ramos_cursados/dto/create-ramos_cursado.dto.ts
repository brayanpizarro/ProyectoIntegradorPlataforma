import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRamosCursadosDto {
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

  @IsOptional()
  @IsNumber()
  semestre?: number;

  @IsOptional()
  @IsString()
  nivel_educativo?: string;

  @IsOptional()
  @IsString()
  nombre_ramo?: string;

  @IsOptional()
  notas_parciales?: any;

  @IsOptional()
  @IsNumber()
  promedio_final?: number;

  @IsOptional()
  @IsString()
  estado?: string;
}
