import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateFamiliaDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  id_estudiante: number;

  @Expose()
  @IsString()
  @IsOptional()
  madre_nombre?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  madre_edad?: number;

  @Expose()
  @IsString()
  @IsOptional()
  padre_nombre?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  padre_edad?: number;

  @Expose()
  @IsArray()
  @IsOptional()
  hermanos?: any[]; // JSON array

  @Expose()
  @IsString()
  @IsOptional()
  observaciones?: string;
}
