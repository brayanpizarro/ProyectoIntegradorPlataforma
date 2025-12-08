import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';
import { Familia } from './entities/familia.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';

@Injectable()
export class FamiliaService {
  constructor(
    @InjectRepository(Familia)
    private readonly familiaRepository: Repository<Familia>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
  ) {}

  async create(createFamiliaDto: CreateFamiliaDto): Promise<Familia> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({
      where: { id_estudiante: createFamiliaDto.id_estudiante },
    });

    if (!estudiante) {
      throw new NotFoundException(
        `Estudiante con ID ${createFamiliaDto.id_estudiante} no encontrado`,
      );
    }

    const familia = this.familiaRepository.create({
      ...createFamiliaDto,
      estudiante,
    });

    return await this.familiaRepository.save(familia);
  }

  async findAll(): Promise<Familia[]> {
    return await this.familiaRepository.find({
      relations: ['estudiante'],
    });
  }

  async findOne(id: number): Promise<Familia> {
    const familia = await this.familiaRepository.findOne({
      where: { id_familia: id },
      relations: ['estudiante'],
    });

    if (!familia) {
      throw new NotFoundException(`Familia con ID ${id} no encontrada`);
    }

    return familia;
  }

  async findByEstudiante(estudianteId: string): Promise<Familia | null> {
    return await this.familiaRepository.findOne({
      where: { estudiante: { id_estudiante: estudianteId } },
      relations: ['estudiante'],
    });
  }

  async update(id: number, updateFamiliaDto: UpdateFamiliaDto): Promise<Familia> {
    const familia = await this.findOne(id);
    
    // Merge de los nuevos datos
    Object.assign(familia, updateFamiliaDto);
    
    return await this.familiaRepository.save(familia);
  }

  async addDescripcionMadre(id: number, nuevaDescripcion: string): Promise<Familia> {
    const familia = await this.findOne(id);
    
    if (!familia.descripcion_madre) {
      familia.descripcion_madre = [];
    }
    
    familia.descripcion_madre.push(nuevaDescripcion);
    
    return await this.familiaRepository.save(familia);
  }

  async addDescripcionPadre(id: number, nuevaDescripcion: string): Promise<Familia> {
    const familia = await this.findOne(id);
    
    if (!familia.descripcion_padre) {
      familia.descripcion_padre = [];
    }
    
    familia.descripcion_padre.push(nuevaDescripcion);
    
    return await this.familiaRepository.save(familia);
  }

  async updateDescripcionMadre(id: number, index: number, nuevaDescripcion: string): Promise<Familia> {
    const familia = await this.findOne(id);
    if (!familia.descripcion_madre || index < 0 || index >= familia.descripcion_madre.length) {
      throw new NotFoundException(`Descripción de madre en índice ${index} no encontrada`);
    }
    familia.descripcion_madre[index] = nuevaDescripcion;
    return await this.familiaRepository.save(familia);
  }

  async deleteDescripcionMadre(id: number, index: number): Promise<Familia> {
    const familia = await this.findOne(id);
    if (!familia.descripcion_madre || index < 0 || index >= familia.descripcion_madre.length) {
      throw new NotFoundException(`Descripción de madre en índice ${index} no encontrada`);
    }
    familia.descripcion_madre.splice(index, 1);
    return await this.familiaRepository.save(familia);
  }

  async updateDescripcionPadre(id: number, index: number, nuevaDescripcion: string): Promise<Familia> {
    const familia = await this.findOne(id);
    if (!familia.descripcion_padre || index < 0 || index >= familia.descripcion_padre.length) {
      throw new NotFoundException(`Descripción de padre en índice ${index} no encontrada`);
    }
    familia.descripcion_padre[index] = nuevaDescripcion;
    return await this.familiaRepository.save(familia);
  }

  async deleteDescripcionPadre(id: number, index: number): Promise<Familia> {
    const familia = await this.findOne(id);
    if (!familia.descripcion_padre || index < 0 || index >= familia.descripcion_padre.length) {
      throw new NotFoundException(`Descripción de padre en índice ${index} no encontrada`);
    }
    familia.descripcion_padre.splice(index, 1);
    return await this.familiaRepository.save(familia);
  }

  async remove(id: number): Promise<void> {
    const familia = await this.findOne(id);
    await this.familiaRepository.remove(familia);
  }
}
