import { Exclude, Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDateString,
  IsEmail,
  IsBoolean,
  IsUUID,
} from 'class-validator';

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
  @IsString()
  tipo?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  estado?: boolean = true;

  @Expose()
  @IsOptional()
  @IsUUID()
  institucionId?: string;
}
