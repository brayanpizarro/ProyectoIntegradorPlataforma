import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { PeriodoAcademico } from './periodo-academico.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';

@Entity('periodo_academico_estudiante')
@Index(['estudiante_id', 'periodo_academico_id'], { unique: true })
export class PeriodoAcademicoEstudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  estudiante_id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ type: 'int' })
  periodo_academico_id: number;

  @ManyToOne(() => PeriodoAcademico)
  @JoinColumn({ name: 'periodo_academico_id' })
  periodo_academico: PeriodoAcademico;

  @Column({ type: 'int', nullable: true })
  institucion_id: number;

  @ManyToOne(() => Institucion, { nullable: true })
  @JoinColumn({ name: 'institucion_id' })
  institucion: Institucion;

  @Column({ type: 'float', nullable: true })
  promedio: number;

  @Column({ type: 'int', nullable: true })
  creditos_aprobados: number;

  @Column({ type: 'int', nullable: true })
  creditos_reprobados: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;
}
