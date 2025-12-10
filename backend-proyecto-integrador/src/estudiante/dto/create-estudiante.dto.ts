import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDateString,
  IsEmail,
  IsEnum,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { TipoEstudiante, StatusEstudiante } from '../entities/estudiante.entity';

@Exclude()
export class CreateEstudianteDto {
  // CAMPOS REQUERIDOS - Solo estos son obligatorios al crear un estudiante
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  rut: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @Expose()
  @IsDateString()
  fecha_de_nacimiento: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  generacion: string;

  // CAMPOS OPCIONALES - Se pueden agregar posteriormente
  @Expose()
  @IsOptional()
  @IsEnum(TipoEstudiante)
  tipo_de_estudiante?: TipoEstudiante;

  @Expose()
  @IsOptional()
  @IsEnum(StatusEstudiante)
  status?: StatusEstudiante;

  @Expose()
  @IsOptional()
  @IsUUID()
  id_institucion?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  numero_carrera?: number;
}
