import { Module } from '@nestjs/common';
import { RamosCursadosService } from './ramos_cursados.service';
import { RamosCursadosController } from './ramos_cursados.controller';

@Module({
  controllers: [RamosCursadosController],
  providers: [RamosCursadosService],
})
export class RamosCursadosModule {}
