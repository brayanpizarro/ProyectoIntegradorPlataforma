import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateRamosCursadosDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  semestre?: number;

  @Expose()
  @IsString()
  @IsOptional()
  nivel_educativo?: string;

  @Expose()
  @IsString()
  @IsOptional()
  nombre_ramo?: string;

  @Expose()
  @IsString()
  @IsOptional()
  notas_parciales?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_final?: number;

  @Expose()
  @IsString()
  @IsOptional()
  estado?: string;
}
