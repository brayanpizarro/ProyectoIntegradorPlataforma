import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateInformacionAcademicaDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_1?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_2?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_3?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_4?: number;

  @Expose()
  @IsString()
  @IsOptional()
  via_acceso?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  ingreso_beca?: number;

  @Expose()
  @IsString()
  @IsOptional()
  colegio?: string;

  @Expose()
  @IsString()
  @IsOptional()
  especialidad_colegio?: string;

  @Expose()
  @IsString()
  @IsOptional()
  comuna_colegio?: string;

  @Expose()
  @IsOptional()
  beneficios?: any;

  @Expose()
  @IsString()
  @IsOptional()
  status_actual?: string;
}
