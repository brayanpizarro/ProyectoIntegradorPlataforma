import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteModule } from './estudiante/estudiante.module';
import { FamiliaModule } from './familia/familia.module';
import { RamosCursadosModule } from './ramos_cursados/ramos_cursados.module';
import { HistorialAcademicoModule } from './historial_academico/historial_academico.module';
import { InformacionAcademicaModule } from './informacion_academica/informacion_academica.module';
import { InstitucionModule } from './institucion/institucion.module';
import { UsersModule } from './users/users.module';
import { EntrevistasModule } from './entrevistas/entrevistas.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { appConfig, databaseConfig, jwtConfig } from './config';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // TypeORM con MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.mysql.host'),
        port: configService.get('database.mysql.port'),
        username: configService.get('database.mysql.username'),
        password: configService.get('database.mysql.password'),
        database: configService.get('database.mysql.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.mysql.synchronize'),
        logging: configService.get('database.mysql.logging'),
        charset: 'utf8mb4',
        timezone: 'Z',
      }),
    }),

    EstudianteModule,
    FamiliaModule,
    RamosCursadosModule,
    HistorialAcademicoModule,
    InformacionAcademicaModule,
    InstitucionModule,
    UsersModule,
    EntrevistasModule,
    AuthModule,
    SeederModule,
  ],
})
export class AppModule {}
