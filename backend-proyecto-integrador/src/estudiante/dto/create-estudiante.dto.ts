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

export class CreateEstudianteDto {
  // CAMPOS OBLIGATORIOS
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsDateString()
  fecha_de_nacimiento: string;

  @IsEnum(TipoEstudiante)
  tipo_de_estudiante: TipoEstudiante;

  // CAMPOS OPCIONALES
  @IsOptional()
  @IsString()
  generacion?: string;

  @IsOptional()
  @IsEnum(StatusEstudiante)
  status?: StatusEstudiante;

  @IsOptional()
  @IsUUID()
  id_institucion?: string;

  @IsOptional()
  @IsNumber()
  numero_carrera?: number;
}
