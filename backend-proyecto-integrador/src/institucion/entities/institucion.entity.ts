import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('instituciones')
export class Institucion {
  @PrimaryGeneratedColumn('uuid')
  id_institucion: string;

  @Column({ unique: true })
  nombre_institucion: string;

  @OneToMany(() => Estudiante, (estudiante) => estudiante.institucion)
  estudiantes: Estudiante[];
}
