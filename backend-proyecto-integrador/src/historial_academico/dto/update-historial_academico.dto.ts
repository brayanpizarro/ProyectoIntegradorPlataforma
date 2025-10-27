import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateHistorialAcademicoDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  año?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  semestre?: number;

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
}
