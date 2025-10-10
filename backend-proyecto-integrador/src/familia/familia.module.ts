import { Module } from '@nestjs/common';
import { FamiliaService } from './familia.service';
import { FamiliaController } from './familia.controller';

@Module({
  controllers: [FamiliaController],
  providers: [FamiliaService],
})
export class FamiliaModule {}
