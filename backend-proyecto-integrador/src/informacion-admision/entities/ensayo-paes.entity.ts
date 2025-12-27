import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { InformacionAdmision } from './informacion-admision.entity';

@Entity('ensayo_paes')
export class EnsayoPaes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  estudiante_id: string;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @Column({ type: 'int', nullable: true })
  admision_id: number;

  @ManyToOne(() => InformacionAdmision, (admision) => admision.ensayos_paes)
  @JoinColumn({ name: 'admision_id' })
  admision: InformacionAdmision;

  @Column({ type: 'int' })
  año: number;

  @Column({ type: 'int', nullable: true })
  mes: number;

  @Column({ nullable: true })
  institucion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntaje_lenguaje: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntaje_matematicas: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntaje_ciencias: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntaje_historia: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;
}
