import { Module } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { InstitucionController } from './institucion.controller';

@Module({
  controllers: [InstitucionController],
  providers: [InstitucionService],
})
export class InstitucionModule {}
