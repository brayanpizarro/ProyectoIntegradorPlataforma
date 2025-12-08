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
  ingreso_beca: number;

  @Column()
  colegio: string; //liceo

  @Column({nullable: true})
  especialidad_colegio: string; // Si es que aplica

  @Column()
  comuna_colegio: string;

  /* TO DO: CREAR PUNTAJE PAES, VER SI ES UN ARRAY */

  @Column({ type: 'json', nullable: true })
  beneficios: any;

  @Column({ nullable: true })
  status_actual: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @OneToOne(() => Estudiante, (estudiante) => estudiante.informacionAcademica)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
