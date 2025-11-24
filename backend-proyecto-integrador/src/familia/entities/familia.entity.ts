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
  madre_nombre: string;

  @Column({ nullable: true })
  madre_edad: number;

  @Column({ nullable: true })
  padre_nombre: string;

  @Column({ nullable: true })
  padre_edad: number;

  @Column({ type: 'json', nullable: true })
  hermanos: any[];

  @Column({ type: 'jsonb', nullable: true , default: { madre: [], padre: [], hermanos: [], general: [] } })
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
