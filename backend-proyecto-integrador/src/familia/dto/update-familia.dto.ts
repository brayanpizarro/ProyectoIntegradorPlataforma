import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateFamiliaDto {
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
  hermanos?: any[];

  @Expose()
  @IsString()
  @IsOptional()
  observaciones?: string;
}
