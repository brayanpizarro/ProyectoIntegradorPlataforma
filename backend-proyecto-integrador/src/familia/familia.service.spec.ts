import { Test, TestingModule } from '@nestjs/testing';
import { FamiliaService } from './familia.service';

describe('FamiliaService', () => {
  let service: FamiliaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamiliaService],
    }).compile();

    service = module.get<FamiliaService>(FamiliaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
