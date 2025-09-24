import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Controller('asignatura')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Post()
  create(@Body() createAsignaturaDto: CreateAsignaturaDto) {
    return this.asignaturaService.create(createAsignaturaDto);
  }

  @Get()
  findAll() {
    return this.asignaturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignaturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsignaturaDto: UpdateAsignaturaDto) {
    return this.asignaturaService.update(+id, updateAsignaturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignaturaService.remove(+id);
  }
}
