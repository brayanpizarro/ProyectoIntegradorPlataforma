import { Test, TestingModule } from '@nestjs/testing';
import { RamosCursadosService } from './ramos_cursados.service';

describe('RamosCursadosService', () => {
  let service: RamosCursadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RamosCursadosService],
    }).compile();

    service = module.get<RamosCursadosService>(RamosCursadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
