import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UserSeeder } from './seeder/seeds/user.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: true, // En producción, especifica el dominio del frontend
    credentials: true,
  });

  if (process.env.AUTO_SEED === 'true') {
    try {
      console.log('🌱 Auto-seeding habilitado...');
      const userSeeder = app.get(UserSeeder);
      await userSeeder.run();
      console.log('✅ Auto-seeding completado');
    } catch (error) {
      console.warn('⚠️ Error en auto-seed (puede que los datos ya existan):', error.message);
    }
  }

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
