import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InformacionAcademicaService } from './informacion_academica.service';
import { CreateInformacionAcademicaDto } from './dto/create-informacion_academica.dto';
import { UpdateInformacionAcademicaDto } from './dto/update-informacion_academica.dto';

@Controller('informacion-academica')
export class InformacionAcademicaController {
  constructor(private readonly informacionAcademicaService: InformacionAcademicaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInformacionAcademicaDto: CreateInformacionAcademicaDto) {
    return await this.informacionAcademicaService.create(createInformacionAcademicaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.informacionAcademicaService.findAll();
  }

  @Get('estudiante/:idEstudiante')
  @HttpCode(HttpStatus.OK)
  async findByEstudiante(@Param('idEstudiante') idEstudiante: string) {
    return await this.informacionAcademicaService.findByEstudiante(+idEstudiante);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.informacionAcademicaService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateInformacionAcademicaDto: UpdateInformacionAcademicaDto) {
    return await this.informacionAcademicaService.update(+id, updateInformacionAcademicaDto);
  }

  @Patch(':id/promedio/:nivel')
  @HttpCode(HttpStatus.OK)
  async updatePromedio(
    @Param('id') id: string,
    @Param('nivel') nivel: '1' | '2' | '3' | '4',
    @Body() body: { promedio: number },
  ) {
    return await this.informacionAcademicaService.updatePromedio(+id, nivel, body.promedio);
  }

  @Post(':id/ensayo-paes')
  @HttpCode(HttpStatus.CREATED)
  async addEnsayoPaes(
    @Param('id') id: string,
    @Body() ensayo: {
      fecha: string;
      competencia_lectora?: number;
      competencia_matematica_m1?: number;
      competencia_matematica_m2?: number;
      ciencias?: number;
      historia?: number;
      observaciones?: string;
    },
  ) {
    return await this.informacionAcademicaService.addEnsayoPaes(+id, ensayo);
  }

  @Patch(':id/ensayo-paes/:index')
  @HttpCode(HttpStatus.OK)
  async updateEnsayoPaes(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() ensayo: {
      fecha: string;
      competencia_lectora?: number;
      competencia_matematica_m1?: number;
      competencia_matematica_m2?: number;
      ciencias?: number;
      historia?: number;
      observaciones?: string;
    },
  ) {
    return await this.informacionAcademicaService.updateEnsayoPaes(+id, +index, ensayo);
  }

  @Delete(':id/ensayo-paes/:index')
  @HttpCode(HttpStatus.OK)
  async deleteEnsayoPaes(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return await this.informacionAcademicaService.deleteEnsayoPaes(+id, +index);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.informacionAcademicaService.remove(+id);
  }
}
  remove(@Param('id') id: string) {
    return this.informacionAcademicaService.remove(+id);
  }
}
