import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { FamiliaService } from '../familia/familia.service';
import { InformacionAcademicaService } from '../informacion_academica/informacion_academica.service';
import { HistorialAcademicoService } from '../historial_academico/historial_academico.service';
import { InstitucionService } from '../institucion/institucion.service';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    private readonly familiaService: FamiliaService,
    private readonly informacionAcademicaService: InformacionAcademicaService,
    private readonly historialAcademicoService: HistorialAcademicoService,
    private readonly institucionService: InstitucionService,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    // Crear el estudiante
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    const estudianteGuardado = await this.estudianteRepository.save(estudiante);

    // Crear registro de Familia usando el servicio
    await this.familiaService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    // Crear registro de Información Académica usando el servicio
    await this.informacionAcademicaService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    // Crear registro de Historial Académico usando el servicio
    await this.historialAcademicoService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    // Si se proporciona id_institucion en el DTO, no se crea institución por defecto
    // El frontend o usuario debe asignar la institución posteriormente si es necesario

    return estudianteGuardado;
  }

  findAll() {
    return this.estudianteRepository.find();
  }

  async findStadistics() {
    const gensInfo = await this.estudianteRepository
      .createQueryBuilder('estudiante')
      .select('estudiante.generacion', 'generacion')
      .addSelect('COUNT(estudiante.id_estudiante)', 'total')
      .addSelect(
        "SUM(CASE WHEN estudiante.status = 'activo' THEN 1 ELSE 0 END)",
        'activos'
      )
      .groupBy('estudiante.generacion')
      .getRawMany(); // retorna array de objs { generacion: string, total: string, activos: string }

    const generaciones = gensInfo.map((r) => ({
      generacion: r.generacion,
      total: parseInt(r.total, 10),
      activos: parseInt(r.activos, 10),
    }));

    const totalGens = generaciones.length;
    const totalStudents = generaciones.reduce((sum, r) => sum + r.total, 0);
    const totalActives = generaciones.reduce((sum, r) => sum + r.activos, 0);

    return {
      generacionesTotal: totalGens,
      estudiantesTotal: totalStudents,
      activosTotal: totalActives,
      generaciones: generaciones,
    };
  }

  findByGeneration(generation: string) {
    return this.estudianteRepository.find({ where: { generacion: generation }, order: { nombre: 'ASC' } });
  }

  findOne(id: string) {
    return this.estudianteRepository.findOne({ where: { id_estudiante: id } });
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return 'this action updates a #' + id + ' estudiante';
  }

  remove(id: number) {
    return this.estudianteRepository.delete(id);
  }
}
