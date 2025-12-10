// =====================================
// SERVICIO DE HISTORIAL ACADÉMICO
// =====================================

import { BaseHttpClient } from './base.http';

class HistorialAcademicoService extends BaseHttpClient {
  
  async create(data: {
    id_estudiante: string;
    año: number;
    semestre: number;
    nivel_educativo?: string;
    ramos_aprobados?: number;
    ramos_reprobados?: number;
    promedio_semestre?: number;
    trayectoria_academica?: string[];
  }) {
    return await this.request('/historial-academico', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getByEstudiante(idEstudiante: string) {
    return await this.request(`/historial-academico/estudiante/${idEstudiante}`);
  }

  async getById(id: number) {
    return await this.request(`/historial-academico/${id}`);
  }

  async update(id: number, data: Partial<{
    año: number;
    semestre: number;
    nivel_educativo: string;
    ramos_aprobados: number;
    ramos_reprobados: number;
    promedio_semestre: number;
    trayectoria_academica: string[];
  }>) {
    return await this.request(`/historial-academico/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async addTrayectoria(id: number, trayectoria: string) {
    return await this.request(`/historial-academico/${id}/trayectoria`, {
      method: 'POST',
      body: JSON.stringify({ trayectoria }),
    });
  }

  async updateTrayectoria(id: number, index: number, trayectoria: string) {
    return await this.request(`/historial-academico/${id}/trayectoria/${index}`, {
      method: 'PATCH',
      body: JSON.stringify({ trayectoria }),
    });
  }

  async deleteTrayectoria(id: number, index: number) {
    return await this.request(`/historial-academico/${id}/trayectoria/${index}`, {
      method: 'DELETE',
    });
  }

  async delete(id: number) {
    return await this.request(`/historial-academico/${id}`, {
      method: 'DELETE',
    });
  }
}

export const historialAcademicoService = new HistorialAcademicoService();
