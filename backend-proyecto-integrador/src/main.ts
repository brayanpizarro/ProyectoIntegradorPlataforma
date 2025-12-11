import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UserSeeder } from './seeder/seeds/user.seeder';

async function bootstrap() {
  if (process.env.RUN_SEEDER === 'true') {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    
    try {
      console.log('Ejecutando seeder inicial...');
      
      const userSeeder = appContext.get(UserSeeder);
      const created = await userSeeder.run();
      
      console.log(`   Usuarios procesados: ${created}`);

    } catch (error) {
      console.error('Error en seeder:', error.message);
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