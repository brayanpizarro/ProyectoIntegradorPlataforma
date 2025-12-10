import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './entities/estudiante.entity';
import { Familia } from '../familia/entities/familia.entity';
import { InformacionAcademica } from '../informacion_academica/entities/informacion_academica.entity';
import { HistorialAcademico } from '../historial_academico/entities/historial_academico.entity';
import { RamosCursados } from '../ramos_cursados/entities/ramos_cursado.entity';
import { Institucion } from '../institucion/entities/institucion.entity';
import { Entrevista } from '../entrevistas/entities/entrevista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Familia, InformacionAcademica, HistorialAcademico, RamosCursados, Institucion, Entrevista])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService]
})
export class EstudianteModule {}
