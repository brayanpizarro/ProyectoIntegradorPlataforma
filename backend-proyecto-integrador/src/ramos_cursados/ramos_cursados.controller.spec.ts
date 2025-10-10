import { Test, TestingModule } from '@nestjs/testing';
import { RamosCursadosController } from './ramos_cursados.controller';
import { RamosCursadosService } from './ramos_cursados.service';

describe('RamosCursadosController', () => {
  let controller: RamosCursadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RamosCursadosController],
      providers: [RamosCursadosService],
    }).compile();

    controller = module.get<RamosCursadosController>(RamosCursadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
