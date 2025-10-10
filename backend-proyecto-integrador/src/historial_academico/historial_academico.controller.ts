import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialAcademicoService } from './historial_academico.service';
import { CreateHistorialAcademicoDto } from './dto/create-historial_academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial_academico.dto';

@Controller('historial-academico')
export class HistorialAcademicoController {
  constructor(private readonly historialAcademicoService: HistorialAcademicoService) {}

  @Post()
  create(@Body() createHistorialAcademicoDto: CreateHistorialAcademicoDto) {
    return this.historialAcademicoService.create(createHistorialAcademicoDto);
  }

  @Get()
  findAll() {
    return this.historialAcademicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialAcademicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialAcademicoDto: UpdateHistorialAcademicoDto) {
    return this.historialAcademicoService.update(+id, updateHistorialAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialAcademicoService.remove(+id);
  }
}
