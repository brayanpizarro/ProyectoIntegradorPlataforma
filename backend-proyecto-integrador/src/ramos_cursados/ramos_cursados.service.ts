import { Injectable } from '@nestjs/common';
import { CreateRamosCursadosDto } from './dto/create-ramos_cursado.dto';
import { UpdateRamosCursadosDto } from './dto/update-ramos_cursado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RamosCursados } from './entities/ramos_cursado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RamosCursadosService {

  constructor(@InjectRepository(RamosCursados) private ramosCursadosRepository: Repository<RamosCursados>) {}

  create(createRamosCursadosDto: CreateRamosCursadosDto) {
    return this.ramosCursadosRepository.create(createRamosCursadosDto);
  }

  findAll() {
    return `This action returns all ramosCursados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ramosCursado`;
  }

  update(id: number, updateRamosCursadosDto: UpdateRamosCursadosDto) {
    return `This action updates a #${id} ramosCursado`;
  }

  remove(id: number) {
    return `This action removes a #${id} ramosCursado`;
  }
}
