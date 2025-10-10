import { Test, TestingModule } from '@nestjs/testing';
import { InformacionAcademicaController } from './informacion_academica.controller';
import { InformacionAcademicaService } from './informacion_academica.service';

describe('InformacionAcademicaController', () => {
  let controller: InformacionAcademicaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformacionAcademicaController],
      providers: [InformacionAcademicaService],
    }).compile();

    controller = module.get<InformacionAcademicaController>(InformacionAcademicaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
