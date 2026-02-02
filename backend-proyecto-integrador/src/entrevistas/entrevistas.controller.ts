import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EntrevistasService } from './entrevistas.service';
import { CreateEntrevistaDto } from './dto/create-entrevista.dto';

@Controller('entrevistas')
@UsePipes(new ValidationPipe({ transform: true }))
export class EntrevistasController {
  constructor(private readonly entrevistasService: EntrevistasService) {}

  @Post()
  async create(@Body() createEntrevistaDto: CreateEntrevistaDto) {
    return this.entrevistasService.create(createEntrevistaDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.entrevistasService.deleteEntrevista(id);
    return { message: 'Entrevista eliminada' };
  }

  @Get()
  async findAll() {
    return this.entrevistasService.findAll();
  }

  @Get('estudiante/:idEstudiante')
  async findOneBy(
    @Param('idEstudiante') idEstudiante: string,
  ) {
    return this.entrevistasService.findByEstudiante(idEstudiante);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<any>,
  ) {
    return this.entrevistasService.updateEntrevista(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.entrevistasService.findOne(id);
  }

  @Get(':id/textos')
  async getTextos(@Param('id') id: string) {
    return this.entrevistasService.getTextosByEntrevista(id);
  }

  @Post(':id/textos')
  async addTexto(
    @Param('id') id: string,
    @Body() textoData: { nombre_etiqueta: string; contenido: string; contexto?: string },
  ) {
    return this.entrevistasService.addTexto(id, textoData);
  }

  @Patch(':id/textos/:textoId')
  async updateTexto(
    @Param('id') id: string,
    @Param('textoId') textoId: string,
    @Body() data: { contenido?: string; contexto?: string },
  ) {
    return this.entrevistasService.updateTexto(id, textoId, data);
  }

  @Delete(':id/textos/:textoId')
  async deleteTexto(@Param('id') id: string, @Param('textoId') textoId: string) {
    await this.entrevistasService.deleteTexto(id, textoId);
    return { message: 'Texto eliminado' };
  }
}
