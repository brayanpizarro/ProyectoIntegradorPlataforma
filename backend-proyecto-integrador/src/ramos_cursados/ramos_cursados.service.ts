import { Injectable } from '@nestjs/common';
import { CreateRamosCursadosDto } from './dto/create-ramos_cursado.dto';
import { UpdateRamosCursadosDto } from './dto/update-ramos_cursado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RamosCursados } from './entities/ramos_cursado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RamosCursadosService {

  constructor(@InjectRepository(RamosCursados) private ramosCursadosRepository: Repository<RamosCursados>) {}

  async create(createRamosCursadosDto: CreateRamosCursadosDto): Promise<RamosCursados> {
    const ramo = this.ramosCursadosRepository.create(createRamosCursadosDto);
    return await this.ramosCursadosRepository.save(ramo);
  }

  async findAll(): Promise<RamosCursados[]> {
    return await this.ramosCursadosRepository.find({
      relations: ['estudiante']
    });
  }

  async findOne(id: number): Promise<RamosCursados | null> {
    return await this.ramosCursadosRepository.findOne({
      where: { id_ramo: id },
      relations: ['estudiante']
    });
  }

  async findByEstudiante(estudianteId: string): Promise<RamosCursados[]> {
    return await this.ramosCursadosRepository.find({
      where: { estudiante: { id_estudiante: estudianteId } },
      relations: ['estudiante'],
      order: { semestre: 'ASC', nombre_ramo: 'ASC' }
    });
  }

  async update(id: number, updateRamosCursadosDto: UpdateRamosCursadosDto): Promise<RamosCursados | null> {
    await this.ramosCursadosRepository.update({ id_ramo: id }, updateRamosCursadosDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ramosCursadosRepository.delete(id);
  }
}
