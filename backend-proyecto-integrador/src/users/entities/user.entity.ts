import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  TUTOR = 'tutor',
  VISITA = 'visita',
}

@Entity('users')
@Unique(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ default: true })
  activo: boolean;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VISITA,
  })
  rol: UserRole;

  @Column({ nullable: true })
  ultimo_login: Date;

  @Column({ nullable: true, type: 'text' })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
