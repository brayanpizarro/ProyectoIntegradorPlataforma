import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Institucion } from '../../institucion/entities/institucion.entity';

export enum TipoEstudiante {
  MEDIA = 'media',
  UNIVERSITARIO = 'universitario',
}

@Entity('estudiante')
export class Estudiante {
  @PrimaryGeneratedColumn('uuid')
  id_estudiante: string;

  @Column()
  nombre: string;

  @Column()
  rut: string;

  @Column()
  telefono: string;

  @Column()
  fecha_de_nacimiento: Date;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: TipoEstudiante,
    default: TipoEstudiante.UNIVERSITARIO,
  })
  tipo_de_estudiante: TipoEstudiante;

  @ManyToOne(() => Institucion, (institucion) => institucion.estudiantes, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_institucion' })
  institucion: Institucion;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
