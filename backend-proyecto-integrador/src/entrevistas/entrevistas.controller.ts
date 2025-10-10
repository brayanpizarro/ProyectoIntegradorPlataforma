import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EntrevistasService } from './entrevistas.service';
import { CreateEntrevistaDto } from './dto/create-entrevista.dto';
import { UpdateEntrevistaDto } from './dto/update-entrevista.dto';
import { EntrevistaFilters } from './interfaces/entrevista.interface';

import type {
  AgregarEtiquetaData,
  PrepararEntrevistaResponse,
  HistorialEtiqueta,
} from './interfaces/entrevista.interface';

@Controller('entrevistas')
@UsePipes(new ValidationPipe())
export class EntrevistasController {
  constructor(private readonly entrevistasService: EntrevistasService) {}

  @Post()
  async create(@Body() createEntrevistaDto: CreateEntrevistaDto) {
    return this.entrevistasService.create(createEntrevistaDto);
  }

  @Get()
  async findAll(
    @Query('idEstudiante') idEstudiante?: string,
    @Query('año') año?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: EntrevistaFilters = {};

    if (idEstudiante) {
      filters.estudianteId = parseInt(idEstudiante);
    }
    if (año) {
      filters.año = parseInt(año);
    }

    const pagination = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    return this.entrevistasService.findAll(filters, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.entrevistasService.findOne(id);
  }

  @Get('estudiante/:idEstudiante')
  async findByEstudiante(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
  ) {
    return this.entrevistasService.findByEstudiante(idEstudiante);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEntrevistaDto: UpdateEntrevistaDto,
  ) {
    return this.entrevistasService.update(id, updateEntrevistaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.entrevistasService.remove(id);
  }

  // Endpoints adicionales para funcionalidades específicas
  @Get('preparar/:idEstudiante/:año')
  async prepararNuevaEntrevista(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Param('año', ParseIntPipe) año: number,
  ): Promise<PrepararEntrevistaResponse> {
    return this.entrevistasService.prepararNuevaEntrevista(idEstudiante, año);
  }

  @Post(':id/etiquetas')
  async agregarEtiqueta(
    @Param('id') id: string,
    @Body() etiquetaData: AgregarEtiquetaData,
  ) {
    return this.entrevistasService.agregarEtiqueta(id, etiquetaData);
  }

  @Get('estudiante/:idEstudiante/etiqueta/:etiqueta')
  async getHistorialEtiqueta(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Param('etiqueta') etiqueta: string,
  ): Promise<HistorialEtiqueta> {
    return this.entrevistasService.getHistorialEtiqueta(idEstudiante, etiqueta);
  }
}
