import { Injectable } from '@nestjs/common';
import { CreateInformacionAcademicaDto } from './dto/create-informacion_academica.dto';
import { UpdateInformacionAcademicaDto } from './dto/update-informacion_academica.dto';

@Injectable()
export class InformacionAcademicaService {
  create(createInformacionAcademicaDto: CreateInformacionAcademicaDto) {
    return 'This action adds a new informacionAcademica';
  }

  findAll() {
    return `This action returns all informacionAcademica`;
  }

  findOne(id: number) {
    return `This action returns a #${id} informacionAcademica`;
  }

  update(id: number, updateInformacionAcademicaDto: UpdateInformacionAcademicaDto) {
    return `This action updates a #${id} informacionAcademica`;
  }

  remove(id: number) {
    return `This action removes a #${id} informacionAcademica`;
  }
}
