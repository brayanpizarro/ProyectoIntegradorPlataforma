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

@Entity('ramos_cursados')
export class RamosCursados {
  @PrimaryGeneratedColumn()
  id_ramo: number;

  @Column({ nullable: true, default: null })
  semestre: number;

  @Column({ nullable: true, default: null })
  nivel_educativo: string;

  @Column({ nullable: true, default: null })
  nombre_ramo: string;

  @Column({ type: 'json', nullable: true })
  notas_parciales: any;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  promedio_final: number;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  id_estudiante: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.ramosCursados)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
