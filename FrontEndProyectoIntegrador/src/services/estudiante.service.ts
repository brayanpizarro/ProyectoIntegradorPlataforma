// =====================================
// SERVICIO DE ESTUDIANTES
// =====================================

import { BaseHttpClient } from './base.http';
import type { Estudiante } from '../types';

class EstudianteService extends BaseHttpClient {
  
  async getAll(): Promise<Estudiante[]> {
    return await this.request<Estudiante[]>('/estudiante');
  }

  async getById(id: string): Promise<Estudiante> {
    return await this.request<Estudiante>(`/estudiante/${id}`);
  }

  async getByGeneracion(año: string): Promise<Estudiante[]> {
    return await this.request<Estudiante[]>(`/estudiante/generacion/${año}`);
  }

  async create(data: Partial<Estudiante>): Promise<Estudiante> {
    return this.request<Estudiante>('/estudiante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<Estudiante>): Promise<Estudiante> {
    return this.request<Estudiante>(`/estudiante/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`/estudiante/${id}`, {
      method: 'DELETE',
    });
  }

  async updateFamiliaInfo(idEstudiante: string, data: {
    mama?: { nombre: string; edad: string; observaciones: string };
    papa?: { nombre: string; edad: string; observaciones: string };
    hermanos?: { nombres: string; observaciones: string };
    otros_familiares?: { nombres: string; observaciones: string };
    observaciones_generales?: string;
  }) {
    return this.request(`/estudiante/${idEstudiante}/familia`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const estudianteService = new EstudianteService();
