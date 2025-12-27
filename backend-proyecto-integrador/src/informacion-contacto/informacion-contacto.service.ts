import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InformacionContacto } from './entities/informacion-contacto.entity';
import { CreateInformacionContactoDto, UpdateInformacionContactoDto } from './dto';

@Injectable()
export class InformacionContactoService {
  constructor(
    @InjectRepository(InformacionContacto)
    private readonly informacionContactoRepository: Repository<InformacionContacto>,
  ) {}

  async create(createDto: CreateInformacionContactoDto): Promise<InformacionContacto> {
    // Verificar si ya existe contacto para este estudiante
    const existe = await this.informacionContactoRepository.findOne({
      where: { estudiante_id: createDto.estudiante_id },
    });

    if (existe) {
      throw new ConflictException('Ya existe información de contacto para este estudiante');
    }

    // Verificar que el email no esté duplicado
    const emailExiste = await this.informacionContactoRepository.findOne({
      where: { email: createDto.email },
    });

    if (emailExiste) {
      throw new ConflictException('El email ya está registrado');
    }

    const contacto = this.informacionContactoRepository.create(createDto);
    return await this.informacionContactoRepository.save(contacto);
  }

  async findAll(): Promise<InformacionContacto[]> {
    return await this.informacionContactoRepository.find({
      relations: ['estudiante'],
    });
  }

  async findOne(id: number): Promise<InformacionContacto> {
    const contacto = await this.informacionContactoRepository.findOne({
      where: { id },
      relations: ['estudiante'],
    });

    if (!contacto) {
      throw new NotFoundException(`Información de contacto con ID ${id} no encontrada`);
    }

    return contacto;
  }

  async findByEstudiante(estudianteId: string): Promise<InformacionContacto> {
    const contacto = await this.informacionContactoRepository.findOne({
      where: { estudiante_id: estudianteId },
      relations: ['estudiante'],
    });

    if (!contacto) {
      throw new NotFoundException(`No se encontró información de contacto para el estudiante`);
    }

    return contacto;
  }

  async update(id: number, updateDto: UpdateInformacionContactoDto): Promise<InformacionContacto> {
    const contacto = await this.findOne(id);

    // Si se está actualizando el email, verificar que no esté duplicado
    if (updateDto.email && updateDto.email !== contacto.email) {
      const emailExiste = await this.informacionContactoRepository.findOne({
        where: { email: updateDto.email },
      });

      if (emailExiste) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    Object.assign(contacto, updateDto);
    return await this.informacionContactoRepository.save(contacto);
  }

  async remove(id: number): Promise<void> {
    const contacto = await this.findOne(id);
    await this.informacionContactoRepository.remove(contacto);
  }
}
