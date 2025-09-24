import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Academico } from '../../academico/entities/academico.entity';

@Entity('asignaturas')
export class Asignatura {
  @PrimaryGeneratedColumn('uuid')
  id_asignatura: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  carrera: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  nota_final: number;

  @Column()
  creditos: number;

  @ManyToMany(() => Academico, (academico) => academico.asignaturas)
  @JoinTable({
    name: 'asignatura_academico',
    joinColumn: {
      name: 'asignatura_id',
      referencedColumnName: 'id_asignatura',
    },
    inverseJoinColumn: {
      name: 'academico_id',
      referencedColumnName: 'id_academico',
    },
  })
  academicos: Academico[];
}
