import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateHistorialAcademicoDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  año: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  semestre: number;

  @Expose()
  @IsString()
  @IsOptional()
  nivel_educativo?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  ramos_aprobados?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  ramos_reprobados?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_semestre?: number;

  @Expose()
  @IsOptional()
  trayectoria_academica?: string[]; // Array de textos incrementales
}
