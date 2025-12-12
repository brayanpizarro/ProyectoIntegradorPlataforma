import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { FamiliaService } from '../familia/familia.service';
import { InformacionAcademicaService } from '../informacion_academica/informacion_academica.service';
import { HistorialAcademicoService } from '../historial_academico/historial_academico.service';
import { InstitucionService } from '../institucion/institucion.service';
import { EntrevistasService } from '../entrevistas/entrevistas.service';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    private readonly familiaService: FamiliaService,
    private readonly informacionAcademicaService: InformacionAcademicaService,
    private readonly historialAcademicoService: HistorialAcademicoService,
    private readonly institucionService: InstitucionService,
    @Inject(forwardRef(() => EntrevistasService))
    private readonly entrevistasService: EntrevistasService,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    const estudianteGuardado = await this.estudianteRepository.save(estudiante);

    await this.familiaService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    await this.informacionAcademicaService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    await this.historialAcademicoService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
    });

    // Crear entrevista inicial automáticamente
    await this.entrevistasService.create({
      id_estudiante: estudianteGuardado.id_estudiante,
      id_usuario: 1, // Usuario admin por defecto
      fecha: new Date().toISOString(),
      nombre_tutor: 'Tutor Asignado',
      año: new Date().getFullYear(),
      numero_entrevista: 1,
      duracion_minutos: 60,
      tipo_entrevista: 'presencial',
      estado: 'programada',
      observaciones: 'Entrevista inicial creada automáticamente',
      temas_abordados: ['Entrevista inicial', 'Evaluación general'],
      etiquetas: []
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
        'activos',
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
    return this.estudianteRepository.find({
      where: { generacion: generation },
      order: { nombre: 'ASC' },
    });
  }

async findOne(id: string) {
  const estudiante = await this.estudianteRepository.findOne({
    where: { id_estudiante: id },
    relations: [
      'institucion',             
      'informacionAcademica',     
      'familia',                 
      'historialesAcademicos',    
      'ramosCursados',         
      'entrevistas',              
    ],
  });
  
  if (!estudiante) {
    throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
  }
  
  return estudiante;
}

  update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    return this.estudianteRepository.update(id, updateEstudianteDto);
  }

  remove(id: string) {
    return this.estudianteRepository.delete(id);
  }
}
