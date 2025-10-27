import { Module } from '@nestjs/common';
import { HistorialAcademicoService } from './historial_academico.service';
import { HistorialAcademicoController } from './historial_academico.controller';

@Module({
  controllers: [HistorialAcademicoController],
  providers: [HistorialAcademicoService],
})
export class HistorialAcademicoModule {}
