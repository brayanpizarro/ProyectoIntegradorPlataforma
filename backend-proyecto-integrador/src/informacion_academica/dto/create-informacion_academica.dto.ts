import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateInformacionAcademicaDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

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
  puntajes_admision?: {
    paes?: {
      competencia_lectora?: number;
      competencia_matematica_m1?: number;
      competencia_matematica_m2?: number;
      ciencias?: number;
      historia?: number;
    };
    psu?: {
      lenguaje?: number;
      matematicas?: number;
      ciencias?: number;
      historia?: number;
    };
    nem?: number;
    ranking?: number;
    ponderado_total?: number;
    año_rendicion?: number;
    observaciones?: string;
  };

  @Expose()
  @IsOptional()
  ensayos_paes?: {
    fecha: string;
    competencia_lectora?: number;
    competencia_matematica_m1?: number;
    competencia_matematica_m2?: number;
    ciencias?: number;
    historia?: number;
    observaciones?: string;
  }[];

  @Expose()
  @IsString()
  @IsOptional()
  beneficios?: string; // Descripción de beneficios
}
