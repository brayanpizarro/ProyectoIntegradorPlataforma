import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreatePeriodoAcademicoEstudianteDto {
  @IsUUID()
  @IsNotEmpty()
  estudiante_id: string;

  @IsInt()
  @IsNotEmpty()
  periodo_academico_id: number;

  @IsInt()
  @IsOptional()
  institucion_id?: number;

  @IsNumber()
  @Min(1.0)
  @Max(7.0)
  @IsOptional()
  promedio?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  creditos_aprobados?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  creditos_reprobados?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
