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

  @Column({ nullable: true })
  nombre_madre: string;

  @Column({ type: 'json', nullable: true, default: [] })
  descripcion_madre: string[];

  @Column({ nullable: true })
  nombre_padre: string;

  @Column({ type: 'json', nullable: true, default: [] })
  descripcion_padre: string[];

  @Column({ type: 'json', nullable: true })
  hermanos: any[];

  @Column({ type: 'json', nullable: true })
  otros_familiares: any[];

  @Column({ type: 'json', nullable: true , default: { madre: [], padre: [], hermanos: [], general: [] } })
  observaciones: ObservacionesFamiliares;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Estudiante
  @OneToOne(() => Estudiante, (estudiante) => estudiante.familia)
  @JoinColumn({ name: 'id_estudiante' })
  estudiante: Estudiante;
}
