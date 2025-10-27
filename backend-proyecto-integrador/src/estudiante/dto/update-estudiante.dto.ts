import { PartialType } from '@nestjs/mapped-types';
import { CreateEstudianteDto } from './create-estudiante.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(2)
  nombre?: string;

  @Expose()
  @IsOptional()
  @IsString()
  rut?: string;

  @Expose()
  @IsOptional()
  @IsString()
  telefono?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  fecha_de_nacimiento?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Expose()
  @IsOptional()
  @IsString()
  tipo?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @Expose()
  @IsOptional()
  @IsUUID()
  institucionId?: string;
}
