import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entrevista, EntrevistaSchema } from './schemas/entrevista.schema';
import { EntrevistasService } from './entrevistas.service';
import { EntrevistasController } from './entrevistas.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entrevista.name, schema: EntrevistaSchema },
    ]),
  ],
  providers: [EntrevistasService],
  controllers: [EntrevistasController],
  exports: [EntrevistasService],
})
export class EntrevistasModule {}
