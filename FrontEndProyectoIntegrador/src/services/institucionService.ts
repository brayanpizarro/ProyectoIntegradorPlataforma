import { BaseHttpClient } from './baseHttpClient';
import type { Institucion } from '../types';

class InstitucionService extends BaseHttpClient {
  constructor() {
    super('/institucion');
  }

  async findAll(): Promise<Institucion[]> {
    return this.get<Institucion[]>('');
  }

  async findOne(id: string): Promise<Institucion> {
    return this.get<Institucion>(`/${id}`);
  }

  async create(data: Partial<Institucion>): Promise<Institucion> {
    return this.post<Institucion>('', data);
  }

  async update(id: string, data: Partial<Institucion>): Promise<Institucion> {
    return this.patch<Institucion>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const institucionService = new InstitucionService();
