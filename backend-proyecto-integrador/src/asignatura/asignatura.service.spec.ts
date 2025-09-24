import { Test, TestingModule } from '@nestjs/testing';
import { AsignaturaService } from './asignatura.service';

describe('AsignaturaService', () => {
  let service: AsignaturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignaturaService],
    }).compile();

    service = module.get<AsignaturaService>(AsignaturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
