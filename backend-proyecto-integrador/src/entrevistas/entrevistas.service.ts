import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entrevista, EntrevistaDocument } from './schemas/entrevista.schema';

@Injectable()
export class EntrevistasService {
  constructor(@InjectModel(Entrevista.name) private entrevistaModel: Model<EntrevistaDocument>) {}

  create(data: Partial<Entrevista>) {
    const doc = new this.entrevistaModel(data);
    return doc.save();
  }

  findByEstudiante(estudianteId: string) {
    return this.entrevistaModel.find({ estudianteId }).exec();
  }

  findAll() {
    return this.entrevistaModel.find().exec();
  }
}
