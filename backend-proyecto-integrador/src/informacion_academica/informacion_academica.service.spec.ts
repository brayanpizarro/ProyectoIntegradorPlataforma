import { Test, TestingModule } from '@nestjs/testing';
import { InformacionAcademicaService } from './informacion_academica.service';

describe('InformacionAcademicaService', () => {
  let service: InformacionAcademicaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InformacionAcademicaService],
    }).compile();

    service = module.get<InformacionAcademicaService>(InformacionAcademicaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
