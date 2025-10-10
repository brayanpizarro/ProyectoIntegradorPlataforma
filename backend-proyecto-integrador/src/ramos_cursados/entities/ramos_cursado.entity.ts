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

  @Column()
  semestre: number;

  @Column({ nullable: true })
  nivel_educativo: string;

  @Column()
  nombre_ramo: string;

  @Column({ type: 'json', nullable: true })
  notas_parciales: any;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  promedio_final: number;

  @Column({ nullable: true })
  estado: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @ManyToOne(() => Estudiante, (estudiante) => estudiante.ramos_cursados)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;

  @Column()
  id_estudiante: number;
}
