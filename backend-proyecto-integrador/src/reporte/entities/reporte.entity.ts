import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('reportes')
export class Reporte {
  @PrimaryGeneratedColumn('uuid')
  id_reporte: string;

  @Column()
  tipo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_generado: Date;

  @Column()
  archivo_url: string;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.reportes, {
    onDelete: 'CASCADE',
  })
  estudiante: Estudiante;
}
