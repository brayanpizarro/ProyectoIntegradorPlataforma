import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './entities/estudiante.entity';
import { FamiliaModule } from '../familia/familia.module';
import { InformacionAcademicaModule } from '../informacion_academica/informacion_academica.module';
import { HistorialAcademicoModule } from '../historial_academico/historial_academico.module';
import { InstitucionModule } from '../institucion/institucion.module';
import { EntrevistasModule } from '../entrevistas/entrevistas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante]),
    FamiliaModule,
    InformacionAcademicaModule,
    HistorialAcademicoModule,
    InstitucionModule,
    forwardRef(() => EntrevistasModule),
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
