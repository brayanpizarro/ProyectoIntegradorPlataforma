import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRamosCursadosDto {
  @IsString()
  @IsNotEmpty()
  id_estudiante: string;

  @IsOptional()
  @IsNumber()
  semestre?: number;

  @IsOptional()
  @IsNumber()
  año?: number;

  @IsOptional()
  @IsNumber()
  oportunidad?: number;

  @IsOptional()
  @IsString()
  codigo_ramo?: string;

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

  @IsOptional()
  @IsString()
  comentarios?: string;
}
