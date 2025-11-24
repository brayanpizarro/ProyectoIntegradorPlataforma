import { DataSource } from 'typeorm';
import { User, UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  // Crear conexión a la base de datos usando las mismas variables de entorno que el backend
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'db',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'myapp',
    entities: [User],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    const userRepository = dataSource.getRepository(User);

    // Verificar si ya existe el usuario admin
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@fundacion.cl' },
    });

    if (existingAdmin) {
      console.log('⚠️  El usuario admin ya existe');
      await dataSource.destroy();
      return;
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@fundacion.cl',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: UserRole.ADMIN,
      activo: true,
    });

    await userRepository.save(adminUser);

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Email: admin@fundacion.cl');
    console.log('🔑 Password: admin123');
    console.log('👤 Rol: admin');

    await dataSource.destroy();
    console.log('✅ Seeder completado');
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
}

seed();
