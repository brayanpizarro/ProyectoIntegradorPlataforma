import { Test, TestingModule } from '@nestjs/testing';
import { FamiliaController } from './familia.controller';
import { FamiliaService } from './familia.service';

describe('FamiliaController', () => {
  let controller: FamiliaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamiliaController],
      providers: [FamiliaService],
    }).compile();

    controller = module.get<FamiliaController>(FamiliaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
