import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateRamosCursadosDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  semestre: number;

  @Expose()
  @IsString()
  @IsOptional()
  nivel_educativo?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  nombre_ramo: string;

  @Expose()
  @IsString()
  @IsOptional()
  notas_parciales?: string; // JSON string

  @Expose()
  @IsNumber()
  @IsOptional()
  promedio_final?: number;

  @Expose()
  @IsString()
  @IsOptional()
  estado?: string;
}
