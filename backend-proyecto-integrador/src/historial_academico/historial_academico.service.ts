import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistorialAcademicoDto } from './dto/create-historial_academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial_academico.dto';
import { HistorialAcademico } from './entities/historial_academico.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class HistorialAcademicoService {
  constructor(
    @InjectRepository(HistorialAcademico)
    private readonly historialRepository: Repository<HistorialAcademico>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createHistorialAcademicoDto: CreateHistorialAcademicoDto): Promise<HistorialAcademico> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: createHistorialAcademicoDto.id_estudiante }
    });
    
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${createHistorialAcademicoDto.id_estudiante} no encontrado`);
    }

    const historial = this.historialRepository.create({
      ...createHistorialAcademicoDto,
      estudiante,
    });
    
    return await this.historialRepository.save(historial);
  }

  async findAll(): Promise<HistorialAcademico[]> {
    return await this.historialRepository.find({
      relations: ['estudiante'],
      order: { año: 'ASC', semestre: 'ASC' },
    });
  }

  async findByEstudiante(idEstudiante: string): Promise<HistorialAcademico[]> {
    return await this.historialRepository.find({
      where: { estudiante: { id_estudiante: idEstudiante } },
      relations: ['estudiante'],
      order: { año: 'ASC', semestre: 'ASC' },
    });
  }

  async findBySemestre(año: number, semestre: number): Promise<HistorialAcademico[]> {
    return await this.historialRepository.find({
      where: { año, semestre },
      relations: ['estudiante'],
    });
  }

  async findOne(id: number): Promise<HistorialAcademico> {
    const historial = await this.historialRepository.findOne({
      where: { id_historial_academico: id },
      relations: ['estudiante'],
    });
    
    if (!historial) {
      throw new NotFoundException(`Historial académico con ID ${id} no encontrado`);
    }
    
    return historial;
  }

  async update(id: number, updateHistorialAcademicoDto: UpdateHistorialAcademicoDto): Promise<HistorialAcademico> {
    const historial = await this.findOne(id);
    
    Object.assign(historial, updateHistorialAcademicoDto);
    
    return await this.historialRepository.save(historial);
  }

  async addTrayectoria(id: number, nuevaTrayectoria: string): Promise<HistorialAcademico> {
    const historial = await this.findOne(id);
    
    if (!historial.trayectoria_academica) {
      historial.trayectoria_academica = [];
    }
    
    historial.trayectoria_academica.push(nuevaTrayectoria);
    
    return await this.historialRepository.save(historial);
  }

  async updateTrayectoria(id: number, index: number, nuevaTrayectoria: string): Promise<HistorialAcademico> {
    const historial = await this.findOne(id);
    
    if (!historial.trayectoria_academica || index < 0 || index >= historial.trayectoria_academica.length) {
      throw new NotFoundException(`Trayectoria en índice ${index} no encontrada`);
    }
    
    historial.trayectoria_academica[index] = nuevaTrayectoria;
    
    return await this.historialRepository.save(historial);
  }

  async deleteTrayectoria(id: number, index: number): Promise<HistorialAcademico> {
    const historial = await this.findOne(id);
    
    if (!historial.trayectoria_academica || index < 0 || index >= historial.trayectoria_academica.length) {
      throw new NotFoundException(`Trayectoria en índice ${index} no encontrada`);
    }
    
    historial.trayectoria_academica.splice(index, 1);
    
    return await this.historialRepository.save(historial);
  }

  async remove(id: number): Promise<void> {
    const historial = await this.findOne(id);
    await this.historialRepository.remove(historial);
  }
}
