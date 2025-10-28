import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './entities/estudiante.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
  ) {}

  create(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    return this.estudianteRepository.save(estudiante);
  }

  findAll() {
    return this.estudianteRepository.find();
  }

  async findStadistics() {
    const gensInfo = await this.estudianteRepository
      .createQueryBuilder('estudiante')
      .select('estudiante.generacion', 'generacion')
      .addSelect('COUNT(estudiante.id_estudiante)', 'total')
      .groupBy('estudiante.generacion')
      .getRawMany(); // retorna array de objs { generacion: string, total: number }
      
    const generaciones = gensInfo.map((r) => ({
      generacion: r.generacion,
      total: parseInt(r.total, 10),
    }));

    const totalGens = generaciones.length;
    const totalStudents = generaciones.reduce((sum, r) => sum + r.total, 0);

    return {
      generacionesTotal: totalGens,
      estudiantesTotal: totalStudents,
      generaciones: generaciones,
    };

    /* VER SI AGREGAR ESTO, QUE SIGNIFICA ACTIVO
    const totalActives = this.estudianteRepository.count({
      where: { },
    })*/
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
