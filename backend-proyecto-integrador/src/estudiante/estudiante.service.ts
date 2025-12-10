import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';
import { Familia } from '../familia/entities/familia.entity';
import { InformacionAcademica } from '../informacion_academica/entities/informacion_academica.entity';
import { HistorialAcademico } from '../historial_academico/entities/historial_academico.entity';
import { RamosCursados } from '../ramos_cursados/entities/ramos_cursado.entity';
import { Institucion } from '../institucion/entities/institucion.entity';
import { Entrevista } from '../entrevistas/entities/entrevista.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Familia)
    private familiaRepository: Repository<Familia>,
    @InjectRepository(InformacionAcademica)
    private informacionAcademicaRepository: Repository<InformacionAcademica>,
    @InjectRepository(HistorialAcademico)
    private historialAcademicoRepository: Repository<HistorialAcademico>,
    @InjectRepository(RamosCursados)
    private ramosCursadosRepository: Repository<RamosCursados>,
    @InjectRepository(Institucion)
    private institucionRepository: Repository<Institucion>,
    @InjectRepository(Entrevista)
    private entrevistaRepository: Repository<Entrevista>,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    // Crear el estudiante
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    const estudianteGuardado = await this.estudianteRepository.save(estudiante);

    // Crear registro de Familia con valores por defecto/null
    const familia = this.familiaRepository.create({
      nombre_madre: 'Sin definir',
      descripcion_madre: [], // Array vacío por defecto
      nombre_padre: 'Sin definir',
      descripcion_padre: [], // Array vacío por defecto
      estudiante: estudianteGuardado,
    });
    await this.familiaRepository.save(familia);

    // Crear registro de Información Académica con valores por defecto/null
    const informacionAcademica = this.informacionAcademicaRepository.create({
      año_ingreso_beca: new Date().getFullYear(), // Año actual por defecto
      colegio: 'Sin definir', // String por defecto
      comuna_colegio: 'Sin definir', // String por defecto
      estudiante: estudianteGuardado,
    });
    await this.informacionAcademicaRepository.save(informacionAcademica);

    // Crear registro de Historial Académico con valores por defecto/null
    const historialAcademico = this.historialAcademicoRepository.create({
      año: new Date().getFullYear(), // Año actual por defecto
      semestre: 1, // Primer semestre por defecto
      estudiante: estudianteGuardado,
    });
    await this.historialAcademicoRepository.save(historialAcademico);

    // Crear institución por defecto vacía
    const institucionPorDefecto = this.institucionRepository.create({
      nombre: 'Sin asignar',
      tipo_institucion: 'Pendiente',
      nivel_educativo: 'Sin definir',
      carrera_especialidad: 'Sin definir',
      duracion: 'Sin definir',
      anio_de_ingreso: 'Sin definir',
      anio_de_egreso: 'Sin definir',
    });
    const institucionGuardada = await this.institucionRepository.save(institucionPorDefecto);
    
    // Asignar la institución por defecto al estudiante
    estudianteGuardado.institucion = institucionGuardada;
    await this.estudianteRepository.save(estudianteGuardado);

    // Crear registro de Ramos Cursados vacío (no se crea automáticamente ya que es una relación OneToMany)
    // Se creará cuando el usuario agregue ramos específicos
    
    // Las entrevistas se crearán solo cuando sea necesario ya que requieren usuario asignado
    // No se crea automáticamente una entrevista vacía

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
