import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('institucion')
export class Institucion {
  @PrimaryGeneratedColumn('uuid')
  id_institucion: string;

  @Column()
  nombre: string;

  /*@Column()
  tipo_institucion: string;

  @Column()
  nivel_educativo: string;
  
  @Column()
  carrera_especialidad: string;
  */

  @Column()
  duracion: string; // Establecer un tipo, y ver si es mejor number o string

  @Column()
  anio_de_ingreso: string;

  @Column()
  anio_de_egreso: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.institucion)
  estudiantes: Estudiante[];
}
