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
  @IsOptional()
  @IsString()
  telefono?: string;

  @Expose()
  @IsDateString()
  fecha_de_nacimiento: string;

  @Expose()
  @IsEmail()
  email: string;

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
  institucionId?: string;
  
  // Revisar si es necesario la generacion, asumo que se refiere al año de egreso
  @Expose()
  @IsString()
  generacion: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  numero_carrera?: number;
}
