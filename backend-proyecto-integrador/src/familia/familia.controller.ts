import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { FamiliaService } from './familia.service';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';

@Controller('familia')
export class FamiliaController {
  constructor(private readonly familiaService: FamiliaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFamiliaDto: CreateFamiliaDto) {
    return await this.familiaService.create(createFamiliaDto);
  }

  @Get()
  async findAll() {
    return await this.familiaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.familiaService.findOne(+id);
  }

  @Get('estudiante/:estudianteId')
  async findByEstudiante(@Param('estudianteId') estudianteId: string) {
    return await this.familiaService.findByEstudiante(estudianteId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFamiliaDto: UpdateFamiliaDto) {
    return await this.familiaService.update(+id, updateFamiliaDto);
  }

  @Patch(':id/descripcion-madre')
  async addDescripcionMadre(
    @Param('id') id: string,
    @Body('descripcion') descripcion: string,
  ) {
    return await this.familiaService.addDescripcionMadre(+id, descripcion);
  }

  @Patch(':id/descripcion-padre')
  async addDescripcionPadre(
    @Param('id') id: string,
    @Body('descripcion') descripcion: string,
  ) {
    return await this.familiaService.addDescripcionPadre(+id, descripcion);
  }

  @Patch(':id/descripcion-madre/:index')
  @HttpCode(HttpStatus.OK)
  async updateDescripcionMadre(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() body: { nuevaDescripcion: string },
  ) {
    return this.familiaService.updateDescripcionMadre(+id, +index, body.nuevaDescripcion);
  }

  @Delete(':id/descripcion-madre/:index')
  @HttpCode(HttpStatus.OK)
  async deleteDescripcionMadre(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return this.familiaService.deleteDescripcionMadre(+id, +index);
  }

  @Patch(':id/descripcion-padre/:index')
  @HttpCode(HttpStatus.OK)
  async updateDescripcionPadre(
    @Param('id') id: string,
    @Param('index') index: string,
    @Body() body: { nuevaDescripcion: string },
  ) {
    return this.familiaService.updateDescripcionPadre(+id, +index, body.nuevaDescripcion);
  }

  @Delete(':id/descripcion-padre/:index')
  @HttpCode(HttpStatus.OK)
  async deleteDescripcionPadre(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return this.familiaService.deleteDescripcionPadre(+id, +index);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.familiaService.remove(+id);
  }
}
