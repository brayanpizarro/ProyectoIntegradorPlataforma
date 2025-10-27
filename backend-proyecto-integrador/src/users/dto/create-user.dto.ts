import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

import { UserRole } from '../entities/user.entity';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres' })
  username: string;

  @Expose()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @Expose()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  apellido: string;

  @Expose()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @Expose()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @Expose()
  @IsOptional()
  @IsBoolean({ message: 'activo debe ser un valor booleano' })
  activo?: boolean = true;

  @Expose()
  @IsEnum(UserRole, { message: 'El rol debe ser "admin", "tutor" o "visita"' })
  rol: UserRole = UserRole.VISITA;
}
