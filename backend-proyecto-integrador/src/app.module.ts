// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { EstudianteModule } from './estudiante/estudiante.module';
import { FamiliaModule } from './familia/familia.module';
import { RamosCursadosModule } from './ramos_cursados/ramos_cursados.module';
import { HistorialAcademicoModule } from './historial_academico/historial_academico.module';
import { InformacionAcademicaModule } from './informacion_academica/informacion_academica.module';
import { InstitucionModule } from './institucion/institucion.module';
import { UsersModule } from './users/users.module';
import { EntrevistasModule } from './entrevistas/entrevistas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'db',  // 👈 importante
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'myapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongo:27017/entrevistas', // 👈 importante
    ),

    // Tus módulos
    EstudianteModule,
    FamiliaModule,
    RamosCursadosModule,
    HistorialAcademicoModule,
    InformacionAcademicaModule,
    InstitucionModule,
    UsersModule,
    EntrevistasModule,
  ],
})
export class AppModule {}
