import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EntrevistasService } from './entrevistas.service';

@Controller('entrevistas')
export class EntrevistasController {
  constructor(private readonly entrevistasService: EntrevistasService) {}

  @Post()
  create(@Body() body: any) {
    return this.entrevistasService.create(body);
  }

  @Get('estudiante/:id')
  findByEstudiante(@Param('id') id: string) {
    return this.entrevistasService.findByEstudiante(id);
  }

  @Get()
  findAll() {
    return this.entrevistasService.findAll();
  }
}
