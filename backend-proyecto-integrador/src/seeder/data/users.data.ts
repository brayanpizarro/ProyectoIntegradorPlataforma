import { UserRole } from '../../users/entities/user.entity';

export const USERS_DATA = [
  {
    username: 'admin',
    email: 'admin@fundacion.cl',
    password: 'admin123', // Se hasheará en el seeder
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: UserRole.ADMIN,
    activo: true,
  },
];