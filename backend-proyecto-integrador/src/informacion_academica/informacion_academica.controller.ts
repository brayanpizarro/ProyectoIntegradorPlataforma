import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InformacionAcademicaService } from './informacion_academica.service';
import { CreateInformacionAcademicaDto } from './dto/create-informacion_academica.dto';
import { UpdateInformacionAcademicaDto } from './dto/update-informacion_academica.dto';

@Controller('informacion-academica')
export class InformacionAcademicaController {
  constructor(private readonly informacionAcademicaService: InformacionAcademicaService) {}

  @Post()
  create(@Body() createInformacionAcademicaDto: CreateInformacionAcademicaDto) {
    return this.informacionAcademicaService.create(createInformacionAcademicaDto);
  }

  @Get()
  findAll() {
    return this.informacionAcademicaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.informacionAcademicaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInformacionAcademicaDto: UpdateInformacionAcademicaDto) {
    return this.informacionAcademicaService.update(+id, updateInformacionAcademicaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.informacionAcademicaService.remove(+id);
  }
}
