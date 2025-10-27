import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateInformacionAcademicaDto {
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
  beneficios?: string;

  @Expose()
  @IsString()
  @IsOptional()
  status_actual?: string;
}
