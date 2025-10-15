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
    // PostgreSQL (configurable por variables de entorno)
    ...(process.env.DISABLE_TYPEORM === 'true'
      ? []
      : [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'password',
            database: process.env.POSTGRES_DB || 'proyecto_integrador',
            autoLoadEntities: true,
            synchronize: true, // Solo desarrollo
            logging: true,
          }),
        ]),

    // MongoDB (local por defecto, Atlas si defines MONGODB_URI)
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/proyecto_integrador',
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
