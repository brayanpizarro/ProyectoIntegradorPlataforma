import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicoDto } from './create-academico.dto';

export class UpdateAcademicoDto extends PartialType(CreateAcademicoDto) {}
