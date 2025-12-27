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

  // === CAMPOS LEGACY ELIMINADOS ===
  // Los siguientes campos fueron migrados a la tabla normalizada 'familiar':
  // - nombre_madre, descripcion_madre
  // - nombre_padre, descripcion_padre
  // - hermanos, observaciones_hermanos
  // - otros_familiares, observaciones_otros_familiares
  // Ahora cada familiar es un registro individual relacionado mediante tipo_familiar

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
