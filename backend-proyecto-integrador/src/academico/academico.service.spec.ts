import { Test, TestingModule } from '@nestjs/testing';
import { AcademicoService } from './academico.service';

describe('AcademicoService', () => {
  let service: AcademicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicoService],
    }).compile();

    service = module.get<AcademicoService>(AcademicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
