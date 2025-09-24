import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { EstudianteModule } from './estudiante/estudiante.module';
import { IstitucionModule } from './istitucion/istitucion.module';
import { InstitucionModule } from './institucion/institucion.module';
import { AcademicoModule } from './academico/academico.module';
import { ReporteModule } from './reporte/reporte.module';
import { AsignaturaModule } from './asignatura/asignatura.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tu_contraseña',
      database: 'tu_base_de_datos',
      entities: [User],
      synchronize: true, // Solo usar en desarrollo
    }),
    UsersModule,
    EstudianteModule,
    IstitucionModule,
    InstitucionModule,
    AcademicoModule,
    ReporteModule,
    AsignaturaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
