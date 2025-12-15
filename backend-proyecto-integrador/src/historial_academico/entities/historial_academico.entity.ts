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

  @Column({ nullable: true, default: null })
  año: number;

  @Column({ nullable: true, default: null })
  semestre: number;

  @Column({ nullable: true, default: null })
  nivel_educativo: string;

  @Column({ nullable: true, default: null })
  ramos_aprobados: number;

  @Column({ nullable: true, default: null })
  ramos_reprobados: number;

  @Column({ nullable: true, default: 0 })
  ramos_eliminados: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_semestre: number;

  @Column({ type: 'json', nullable: true, default: () => "'[]'" })
  trayectoria_academica: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.historialesAcademicos)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
