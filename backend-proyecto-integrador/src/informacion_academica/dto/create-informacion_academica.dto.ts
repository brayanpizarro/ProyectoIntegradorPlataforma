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
  promedio_media?: number;

  @Expose()
  @IsString()
  @IsOptional()
  via_acceso?: string;

  @Expose()
  @IsString()
  @IsOptional()
  beneficios?: string; // JSON string

  @Expose()
  @IsString()
  @IsOptional()
  status_actual?: string;
}
