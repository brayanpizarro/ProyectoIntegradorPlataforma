import { Injectable } from '@nestjs/common';
import { CreateRamosCursadoDto } from './dto/create-ramos_cursado.dto';
import { UpdateRamosCursadoDto } from './dto/update-ramos_cursado.dto';

@Injectable()
export class RamosCursadosService {
  create(createRamosCursadoDto: CreateRamosCursadoDto) {
    return 'This action adds a new ramosCursado';
  }

  findAll() {
    return `This action returns all ramosCursados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ramosCursado`;
  }

  update(id: number, updateRamosCursadoDto: UpdateRamosCursadoDto) {
    return `This action updates a #${id} ramosCursado`;
  }

  remove(id: number) {
    return `This action removes a #${id} ramosCursado`;
  }
}
