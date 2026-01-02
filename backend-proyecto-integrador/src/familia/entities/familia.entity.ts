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
import type { ObservacionesFamiliares } from '../../common/index';

@Entity('familias')
export class Familia {
  @PrimaryGeneratedColumn()
  id_familia: number;

  // Campos básicos solicitados por el frontend actual
  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_madre?: string;

  @Column({ type: 'json', nullable: true, default: () => "'[]'" })
  descripcion_madre?: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_padre?: string;

  @Column({ type: 'json', nullable: true, default: () => "'[]'" })
  descripcion_padre?: string[];

  @Column({ type: 'json', nullable: true, default: () => "'[]'" })
  hermanos?: any[];

  @Column({ type: 'text', nullable: true })
  observaciones_hermanos?: string;

  @Column({ type: 'json', nullable: true, default: () => "'[]'" })
  otros_familiares?: any[];

  @Column({ type: 'text', nullable: true })
  observaciones_otros_familiares?: string;

  @Column({ type: 'json', nullable: true , default: { madre: [], padre: [], hermanos: [], general: [] } })
  observaciones: ObservacionesFamiliares;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @OneToOne(() => Estudiante)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
