import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('periodo_academico')
@Index(['año', 'semestre'], { unique: true })
export class PeriodoAcademico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  año: number;

  @Column({ type: 'int' })
  semestre: number;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @Column({ default: false })
  es_actual: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
