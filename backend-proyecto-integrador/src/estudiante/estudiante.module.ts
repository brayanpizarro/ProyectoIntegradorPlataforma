import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Estudiante } from './entities/estudiante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService]
})
export class EstudianteModule {}
