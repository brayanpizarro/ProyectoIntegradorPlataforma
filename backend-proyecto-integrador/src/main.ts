import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UserSeeder } from './seeder/seeds/user.seeder';
import { DataSource } from 'typeorm';

async function bootstrap() {
  if (process.env.RUN_SEEDER === 'true') {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    
    try {
      console.log('🌱 Ejecutando seeder inicial...');
      
      // Obtener DataSource correctamente
      const dataSource = appContext.get(DataSource);
      console.log('📊 BD:', dataSource.options.database);
      
      // Ejecutar seeder
      const userSeeder = appContext.get(UserSeeder);
      const created = await userSeeder.run();
      
      // Verificar usuarios en BD
      const userRepo = dataSource.getRepository('User');
      const totalUsers = await userRepo.count();
      const adminUser = await userRepo.findOne({ 
        where: { email: 'admin@fundacion.cl' } 
      });
      
      console.log('━'.repeat(60));
      console.log(`📊 RESUMEN:`);
      console.log(`   Usuarios procesados: ${created}`);
      console.log(`   Total usuarios en BD: ${totalUsers}`);
      console.log(`   Admin existe: ${adminUser ? '✅ SÍ' : '❌ NO'}`);
      if (adminUser) {
        console.log(`   Admin ID: ${adminUser.id}`);
        console.log(`   Admin Username: ${adminUser.username}`);
        console.log(`   Admin Email: ${adminUser.email}`);
      }
      console.log('━'.repeat(60) + '\n');
      
    } catch (error) {
      console.error('❌ Error en seeder:', error.message);
      console.error('Stack:', error.stack);
    } finally {
      await appContext.close();
    }
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();