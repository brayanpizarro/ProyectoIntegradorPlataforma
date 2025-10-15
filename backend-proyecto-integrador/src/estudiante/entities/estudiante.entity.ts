import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Familia } from '../../familia/entities/familia.entity';
import { RamosCursados } from 'src/ramos_cursados/entities/ramos_cursado.entity';
import { HistorialAcademico } from 'src/historial_academico/entities/historial_academico.entity';
import { InformacionAcademica } from 'src/informacion_academica/entities/informacion_academica.entity';

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

  @OneToOne(() => Familia, (familia) => familia.estudiante, { nullable: true })
  familia: Familia;

  @OneToMany(() => RamosCursados, (ramo) => ramo.estudiante)
  ramosCursados: RamosCursados[];

  @OneToMany(() => HistorialAcademico, (historial) => historial.estudiante)
  historialesAcademicos: HistorialAcademico[];

  @OneToOne(() => InformacionAcademica, (info) => info.estudiante, {
    nullable: true,
  })
  informacionAcademica: InformacionAcademica;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
