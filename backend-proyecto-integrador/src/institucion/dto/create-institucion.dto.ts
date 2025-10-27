import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateInstitucionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  tipo_institucion: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  nivel_educativo: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  carrera_especialidad: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  anio_de_ingreso: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  anio_de_egreso: string;
}
