import { Test, TestingModule } from '@nestjs/testing';
import { HistorialAcademicoController } from './historial_academico.controller';
import { HistorialAcademicoService } from './historial_academico.service';

describe('HistorialAcademicoController', () => {
  let controller: HistorialAcademicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialAcademicoController],
      providers: [HistorialAcademicoService],
    }).compile();

    controller = module.get<HistorialAcademicoController>(HistorialAcademicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
