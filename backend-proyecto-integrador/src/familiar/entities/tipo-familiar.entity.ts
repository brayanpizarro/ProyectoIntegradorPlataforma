import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum TipoFamiliarCodigo {
  MADRE = 'MADRE',
  PADRE = 'PADRE',
  HERMANO = 'HERMANO',
  ABUELO = 'ABUELO',
  TIO = 'TIO',
  OTRO = 'OTRO',
}

@Entity('tipo_familiar')
export class TipoFamiliar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({
    type: 'enum',
    enum: TipoFamiliarCodigo,
    unique: true,
  })
  codigo: TipoFamiliarCodigo;

  @Column({ type: 'int', default: 0 })
  orden: number;
}
