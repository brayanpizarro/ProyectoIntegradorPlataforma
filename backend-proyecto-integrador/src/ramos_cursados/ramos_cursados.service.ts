import { Injectable } from '@nestjs/common';
import { CreateRamosCursadosDto } from './dto/create-ramos_cursado.dto';
import { UpdateRamosCursadosDto } from './dto/update-ramos_cursado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RamosCursados } from './entities/ramos_cursado.entity';
import { Repository, IsNull } from 'typeorm';

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

  async findByEstudiante(estudianteId: string, filtros?: { año?: number; semestre?: number }): Promise<RamosCursados[]> {
    const whereCondition: any = { estudiante: { id_estudiante: estudianteId } };
    
    if (filtros?.año) {
      whereCondition.año = filtros.año;
    }
    
    if (filtros?.semestre) {
      whereCondition.semestre = filtros.semestre;
    }
    
    console.log(`🔍 Buscando ramos para estudiante ${estudianteId} con filtros:`, whereCondition);
    
    return await this.ramosCursadosRepository.find({
      where: whereCondition,
      relations: ['estudiante'],
      order: { semestre: 'ASC', nombre_ramo: 'ASC' }
    });
  }

  async update(id: number, updateRamosCursadosDto: UpdateRamosCursadosDto): Promise<RamosCursados | null> {
    await this.ramosCursadosRepository.update({ id_ramo: id }, updateRamosCursadosDto);
    return this.findOne(id);
  }

  async fixSemestres(): Promise<any> {
    // Obtener todos los ramos que no tienen año o semestre
    const ramosSinSemestre = await this.ramosCursadosRepository.find({
      where: [
        { año: IsNull() },
        { semestre: IsNull() }
      ]
    });

    console.log(`🔧 Encontrados ${ramosSinSemestre.length} ramos sin año/semestre asignado`);
    console.log('✅ Usando IsNull() para consultas TypeORM');

    const updates: Array<{ id: number; nombre: string; año: number; semestre: number }> = [];

    for (const ramo of ramosSinSemestre) {
      let año = 2025;
      let semestre = 1;

      // Lógica basada en el nombre del ramo
      const nombre = ramo.nombre_ramo?.toLowerCase() || '';
      
      if (nombre.includes('calculo2') || nombre.includes('cálculo2')) {
        año = 2025;
        semestre = 1;
      } else if (nombre.includes('calculo3') || nombre.includes('cálculo3')) {
        año = 2025;
        semestre = 2;
      } else if (nombre.includes('calculo1') || nombre.includes('cálculo1')) {
        año = 2024;
        semestre = 2;
      } else {
        // Alternar entre semestres para otros ramos
        año = 2025;
        semestre = (ramo.id_ramo % 2) + 1;
      }

      // Actualizar el ramo
      await this.ramosCursadosRepository.update(ramo.id_ramo, {
        año,
        semestre,
        oportunidad: ramo.oportunidad || 1 // Asignar primera oportunidad por defecto
      });

      updates.push({
        id: ramo.id_ramo,
        nombre: ramo.nombre_ramo,
        año,
        semestre
      });

      console.log(`✅ ${ramo.nombre_ramo} → ${año}/${semestre}`);
    }

    return {
      message: `Se actualizaron ${updates.length} ramos`,
      updates: updates
    };
  }

  async remove(id: number): Promise<void> {
    await this.ramosCursadosRepository.delete(id);
  }
}
