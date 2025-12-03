import { User, UserRole } from './users/entities/user.entity';
import { Estudiante, TipoEstudiante } from './estudiante/entities/estudiante.entity';
import { Institucion } from './institucion/entities/institucion.entity';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';

async function seed() {
  const dataSource = AppDataSource;

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
    } else {
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
    }

    // Crear institución de prueba
    const institucionRepository = dataSource.getRepository(Institucion);
    
    const institucion = institucionRepository.create({
      nombre: 'Universidad de Chile',
      tipo_institucion: 'Universidad',
      nivel_educativo: 'Superior',
      carrera_especialidad: 'Ingeniería Civil en Computación',
      duracion: '5 años',
      anio_de_ingreso: '2024',
      anio_de_egreso: '2029'
    });

    await institucionRepository.save(institucion);
    console.log('✅ Institución de prueba creada');

    // Crear estudiante de prueba
    const estudianteRepository = dataSource.getRepository(Estudiante);
    
    const estudiante = estudianteRepository.create({
      nombre: 'Juan Carlos Pérez González',
      rut: '12.345.678-9',
      email: 'juan.perez@ejemplo.cl',
      telefono: '+56912345678',
      fecha_de_nacimiento: new Date('2000-05-15'),
      tipo_de_estudiante: TipoEstudiante.UNIVERSITARIO,
      generacion: '2024',
      activo: true,
      institucion: institucion
    });

    await estudianteRepository.save(estudiante);
    console.log('✅ Estudiante de prueba creado');
    console.log('👨‍🎓 Nombre: Juan Carlos Pérez González');
    console.log('🎓 RUT: 12.345.678-9');
    console.log('📅 Generación: 2024');

    await dataSource.destroy();
    console.log('✅ Seeder completado');
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
}

seed();
