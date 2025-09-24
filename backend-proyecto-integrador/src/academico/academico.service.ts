import { Injectable } from '@nestjs/common';
import { CreateAcademicoDto } from './dto/create-academico.dto';
import { UpdateAcademicoDto } from './dto/update-academico.dto';

@Injectable()
export class AcademicoService {
  create(createAcademicoDto: CreateAcademicoDto) {
    return 'This action adds a new academico';
  }

  findAll() {
    return `This action returns all academico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} academico`;
  }

  update(id: number, updateAcademicoDto: UpdateAcademicoDto) {
    return `This action updates a #${id} academico`;
  }

  remove(id: number) {
    return `This action removes a #${id} academico`;
  }
}
