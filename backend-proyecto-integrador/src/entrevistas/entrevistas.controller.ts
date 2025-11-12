import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EntrevistasService } from './entrevistas.service';
import { CreateEntrevistaDto } from './dto/create-entrevista.dto';

@Controller('entrevistas')
@UsePipes(new ValidationPipe())
export class EntrevistasController {
  constructor(private readonly entrevistasService: EntrevistasService) {}

  @Post()
  async create(@Body() createEntrevistaDto: CreateEntrevistaDto) {
    return this.entrevistasService.create(createEntrevistaDto);
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
}
