import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { TipoFamiliar } from './tipo-familiar.entity';

@Entity('familiar')
export class Familiar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  estudiante_id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ type: 'int' })
  tipo_familiar_id: number;

  @ManyToOne(() => TipoFamiliar)
  @JoinColumn({ name: 'tipo_familiar_id' })
  tipo_familiar: TipoFamiliar;

  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ nullable: true })
  parentesco: string;

  @Column({ nullable: true })
  ocupacion: string;

  @Column({ nullable: true })
  nivel_educacional: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
