import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Entrevista } from './entrevista.entity';
import { Etiqueta } from './etiqueta.entity';

@Entity('texto')
export class Texto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Entrevista, (entrevista) => entrevista.textos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_entrevista' })
  entrevista: Entrevista;

  @Column({ name: 'id_entrevista' })
  entrevistaId: string;

  @ManyToOne(() => Etiqueta, {
    nullable: false,
  })
  @JoinColumn({ name: 'nombre_etiqueta' })
  etiqueta: Etiqueta;

  @Column({ name: 'nombre_etiqueta', type: 'varchar' })
  nombre_etiqueta: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  contexto?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
