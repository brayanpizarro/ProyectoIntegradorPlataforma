import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { Beneficio } from './beneficio.entity';

@Entity('beneficio_estudiante')
export class BeneficioEstudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  estudiante_id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ type: 'int' })
  beneficio_id: number;

  @ManyToOne(() => Beneficio)
  @JoinColumn({ name: 'beneficio_id' })
  beneficio: Beneficio;

  @Column({ type: 'int' })
  año_inicio: number;

  @Column({ type: 'int', nullable: true })
  año_termino: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;
}
