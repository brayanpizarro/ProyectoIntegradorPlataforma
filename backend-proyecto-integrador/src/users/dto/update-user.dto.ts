import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name?: string | undefined;
  password?: string | undefined;
  isActive?: boolean | undefined;
  email?: string | undefined;
}
