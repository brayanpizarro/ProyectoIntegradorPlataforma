import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('informacion_academica')
export class InformacionAcademica {
  @PrimaryGeneratedColumn()
  id_info_academico: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_1: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_2: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_3: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_4: number;

  @Column({ nullable: true })
  via_acceso: string;

  @Column()
  año_ingreso_beca: number;

  @Column()
  colegio: string; //liceo

  @Column({nullable: true})
  especialidad_colegio: string; // Si es que aplica

  @Column()
  comuna_colegio: string;

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
  puntajes_admision: any;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  ensayos_paes: any[];

  @Column({ type: 'text', nullable: true })
  beneficios: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @OneToOne(() => Estudiante, (estudiante) => estudiante.informacionAcademica)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
