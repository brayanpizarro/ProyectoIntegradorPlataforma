import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FamiliarService } from './familiar.service';
import {
  CreateTipoFamiliarDto,
  UpdateTipoFamiliarDto,
  CreateFamiliarDto,
  UpdateFamiliarDto,
} from './dto';

@Controller('familiar')
export class FamiliarController {
  constructor(private readonly familiarService: FamiliarService) {}

  // === TIPO FAMILIAR ===

  @Post('tipos')
  createTipo(@Body() createDto: CreateTipoFamiliarDto) {
    return this.familiarService.createTipo(createDto);
  }

  @Get('tipos')
  findAllTipos() {
    return this.familiarService.findAllTipos();
  }

  @Get('tipos/:id')
  findOneTipo(@Param('id', ParseIntPipe) id: number) {
    return this.familiarService.findOneTipo(id);
  }

  @Patch('tipos/:id')
  updateTipo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTipoFamiliarDto,
  ) {
    return this.familiarService.updateTipo(id, updateDto);
  }

  @Delete('tipos/:id')
  removeTipo(@Param('id', ParseIntPipe) id: number) {
    return this.familiarService.removeTipo(id);
  }

  @Post('tipos/seed')
  seedTipos() {
    return this.familiarService.seedTiposFamiliares();
  }

  // === FAMILIAR ===

  @Post()
  create(@Body() createDto: CreateFamiliarDto) {
    return this.familiarService.create(createDto);
  }

  @Get()
  findAll() {
    return this.familiarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiarService.findOne(id);
  }

  @Get('estudiante/:estudianteId')
  findByEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.familiarService.findByEstudiante(estudianteId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateFamiliarDto,
  ) {
    return this.familiarService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiarService.remove(id);
  }
}
