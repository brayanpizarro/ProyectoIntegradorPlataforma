import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';

@Entity('academicos')
export class Academico {
  @PrimaryGeneratedColumn('uuid')
  id_academico: string;

  @Column()
  semestre: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  promedio: number;

  @Column({ default: 'ACTIVO' })
  estado: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.academicos, {
    onDelete: 'CASCADE',
  })
  estudiante: Estudiante;

  @ManyToMany(() => Asignatura, (asignatura) => asignatura.academicos)
  asignaturas: Asignatura[];
}
