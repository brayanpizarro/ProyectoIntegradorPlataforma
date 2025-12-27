import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum TipoBeneficio {
  BECA = 'BECA',
  CREDITO = 'CREDITO',
  GRATUIDAD = 'GRATUIDAD',
  BENEFICIO_ESTATAL = 'BENEFICIO_ESTATAL',
}

@Entity('beneficio')
export class Beneficio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ unique: true })
  codigo: string;

  @Column({
    type: 'enum',
    enum: TipoBeneficio,
    nullable: true,
  })
  tipo: TipoBeneficio;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ default: true })
  activo: boolean;
}
