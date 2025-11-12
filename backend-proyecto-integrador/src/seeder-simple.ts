// src/seeder-simple.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

async function seed() {
  console.log('🌱 Iniciando seeder simple (solo usuarios)...');
  
  try {
    // Crear contexto de aplicación NestJS
    const app = await NestFactory.createApplicationContext(AppModule);
    
    console.log('📦 Conexión a la base de datos establecida');

    // Obtener servicio de usuarios
    const usersService = app.get(UsersService);

    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    
    try {
      await usersService.create({
        username: 'admin',
        email: 'admin@proyectointegrador.com',
        password: 'admin123',
        nombre: 'Administrador',
        apellido: 'Sistema',
        rol: UserRole.ADMIN,
      });
      console.log('✅ Usuario admin creado');
    } catch (error) {
      console.log('⚠️ Usuario admin ya existe o error:', error.message);
    }

    try {
      await usersService.create({
        username: 'tutor1',
        email: 'tutor1@proyectointegrador.com',
        password: 'tutor123',
        nombre: 'María José',
        apellido: 'Hernández',
        rol: UserRole.TUTOR,
      });
      console.log('✅ Usuario tutor creado');
    } catch (error) {
      console.log('⚠️ Usuario tutor ya existe o error:', error.message);
    }

    try {
      await usersService.create({
        username: 'visita',
        email: 'visita@proyectointegrador.com',
        password: 'visita123',
        nombre: 'Invitado',
        apellido: 'Demo',
        rol: UserRole.VISITA,
      });
      console.log('✅ Usuario visita creado');
    } catch (error) {
      console.log('⚠️ Usuario visita ya existe o error:', error.message);
    }

    console.log('\n🎉 Seeder de usuarios completado exitosamente!');
    console.log('\n📋 Usuarios disponibles para login:');
    console.log('   👨‍💼 Admin: admin@proyectointegrador.com / admin123');
    console.log('   👩‍🏫 Tutor: tutor1@proyectointegrador.com / tutor123');
    console.log('   👤 Visita: visita@proyectointegrador.com / visita123');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    process.exit(1);
  }
}

seed();