import { Injectable } from '@nestjs/common';
import { CreateHistorialAcademicoDto } from './dto/create-historial_academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial_academico.dto';

@Injectable()
export class HistorialAcademicoService {
  create(createHistorialAcademicoDto: CreateHistorialAcademicoDto) {
    return 'This action adds a new historialAcademico';
  }

  findAll() {
    return `This action returns all historialAcademico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialAcademico`;
  }

  update(id: number, updateHistorialAcademicoDto: UpdateHistorialAcademicoDto) {
    return `This action updates a #${id} historialAcademico`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialAcademico`;
  }
}
