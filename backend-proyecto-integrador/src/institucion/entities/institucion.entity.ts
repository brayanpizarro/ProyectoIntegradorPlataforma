import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('institucion')
export class Institucion {
  @PrimaryGeneratedColumn('uuid')
  id_institucion: string;

  @Column({ nullable: true, default: null })
  nombre: string;

  @Column({ nullable: true, default: null })
  tipo_institucion: string;

  @Column({ nullable: true, default: null })
  nivel_educativo: string;
  
  @Column({ nullable: true, default: null })
  carrera_especialidad: string;

  @Column({ nullable: true, default: null })
  duracion: string;

  @Column({ nullable: true, default: null })
  anio_de_ingreso: string;

  @Column({ nullable: true, default: null })
  anio_de_egreso: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.institucion)
  estudiantes: Estudiante[];
}
