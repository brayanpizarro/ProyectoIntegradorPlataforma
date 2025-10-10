import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exclude, Expose } from 'class-transformer';

export class TextoEtiquetaDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @Expose()
  @IsString()
  @IsOptional()
  contexto?: string;
}

export class EtiquetaDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  nombre_etiqueta: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TextoEtiquetaDto)
  textos: TextoEtiquetaDto[];
}

@Exclude()
export class CreateEntrevistaDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Min(2)
  nombre_tutor: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(2020)
  @Max(2030)
  año: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(6)
  numero_entrevista: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(15)
  @Max(180)
  duracion_minutos: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['presencial', 'virtual', 'mixta'])
  tipo_entrevista: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['programada', 'completada', 'cancelada', 'reprogramada'])
  estado: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Min(10)
  observaciones: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Min(1, { each: true })
  temas_abordados: string[];

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EtiquetaDto)
  etiquetas: EtiquetaDto[];
}
