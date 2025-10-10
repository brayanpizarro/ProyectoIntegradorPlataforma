import { Module } from '@nestjs/common';
import { InformacionAcademicaService } from './informacion_academica.service';
import { InformacionAcademicaController } from './informacion_academica.controller';

@Module({
  controllers: [InformacionAcademicaController],
  providers: [InformacionAcademicaService],
})
export class InformacionAcademicaModule {}
