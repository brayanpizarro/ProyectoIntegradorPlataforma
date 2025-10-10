import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { InstitucionModule } from './institucion/institucion.module';
import { EntrevistasModule } from './entrevistas/entrevistas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'tu_contraseña',
      database: process.env.POSTGRES_DB ?? 'tu_base_de_datos',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo usar en desarrollo
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/entrevistas',
    ),
    UsersModule,
    EstudianteModule,
    InstitucionModule,
    EntrevistasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
