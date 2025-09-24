import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcademicoService } from './academico.service';
import { CreateAcademicoDto } from './dto/create-academico.dto';
import { UpdateAcademicoDto } from './dto/update-academico.dto';

@Controller('academico')
export class AcademicoController {
  constructor(private readonly academicoService: AcademicoService) {}

  @Post()
  create(@Body() createAcademicoDto: CreateAcademicoDto) {
    return this.academicoService.create(createAcademicoDto);
  }

  @Get()
  findAll() {
    return this.academicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcademicoDto: UpdateAcademicoDto) {
    return this.academicoService.update(+id, updateAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.academicoService.remove(+id);
  }
}
