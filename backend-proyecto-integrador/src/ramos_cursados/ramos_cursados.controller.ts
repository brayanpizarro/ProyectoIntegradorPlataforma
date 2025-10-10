import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RamosCursadosService } from './ramos_cursados.service';
import { CreateRamosCursadoDto } from './dto/create-ramos_cursado.dto';
import { UpdateRamosCursadoDto } from './dto/update-ramos_cursado.dto';

@Controller('ramos-cursados')
export class RamosCursadosController {
  constructor(private readonly ramosCursadosService: RamosCursadosService) {}

  @Post()
  create(@Body() createRamosCursadoDto: CreateRamosCursadoDto) {
    return this.ramosCursadosService.create(createRamosCursadoDto);
  }

  @Get()
  findAll() {
    return this.ramosCursadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ramosCursadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRamosCursadoDto: UpdateRamosCursadoDto) {
    return this.ramosCursadosService.update(+id, updateRamosCursadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ramosCursadosService.remove(+id);
  }
}
