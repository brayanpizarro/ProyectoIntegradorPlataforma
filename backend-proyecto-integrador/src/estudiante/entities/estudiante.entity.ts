import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Academico } from '../../academico/entities/academico.entity';
import { Reporte } from '../../reporte/entities/reporte.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';

@Entity('estudiantes')
export class Estudiante {
  @PrimaryGeneratedColumn('uuid')
  id_estudiante: string;

  @Column()
  nombre: string;

  @Column()
  rut: string;

  @Column()
  fecha_de_nacimiento: Date;

  @Column()
  contacto: string;

  @Column()
  direccion: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Academico, academico => academico.estudiante)
  academicos: Academico[];

  @OneToMany(() => Reporte, reporte => reporte.estudiante)
  reportes: Reporte[];

  @ManyToOne(() => Institucion, institucion => institucion.estudiantes)
  institucion: Institucion;
}
