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

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  promedio_media: number;

  @Column({ nullable: true })
  via_acceso: string;

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
  @JoinColumn({ name: 'id_Estudiante' })
  estudiante: Estudiante;

  @Column()
  id_estudiante: number;
}
