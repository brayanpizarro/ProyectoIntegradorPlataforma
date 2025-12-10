import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateHistorialAcademicoDto {
  @IsString()
  @IsNotEmpty()
  id_estudiante: string;

  @IsOptional()
  @IsNumber()
  año?: number;

  @IsOptional()
  @IsNumber()
  semestre?: number;

  @IsOptional()
  @IsString()
  nivel_educativo?: string;

  @IsOptional()
  @IsNumber()
  ramos_aprobados?: number;

  @IsOptional()
  @IsNumber()
  ramos_reprobados?: number;

  @IsOptional()
  @IsNumber()
  promedio_semestre?: number;

  @IsOptional()
  trayectoria_academica?: string[];
}
