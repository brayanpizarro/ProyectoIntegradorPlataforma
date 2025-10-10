import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('historial_academico')
export class HistorialAcademico {
  @PrimaryGeneratedColumn()
  id_historial_academico: number;

  @Column()
  año: number;

  @Column()
  semestre: number;

  @Column({ nullable: true })
  nivel_educativo: string;

  @Column({ default: 0 })
  ramos_aprobados: number;

  @Column({ default: 0 })
  ramos_reprobados: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  promedio_semestre: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.historial_academico)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  @Column()
  id_estudiante: number;
}
