// =====================================
// SERVICIO DE RAMOS CURSADOS
// =====================================

import { BaseHttpClient } from './base.http';

class RamosCursadosService extends BaseHttpClient {
  
  async getAll(): Promise<any[]> {
    return await this.request<any[]>('/ramos-cursados');
  }

  async getById(id: string): Promise<any> {
    return await this.request<any>(`/ramos-cursados/${id}`);
  }

  async getByEstudiante(estudianteId: string, año?: number, semestre?: number): Promise<any[]> {
    let url = `/ramos-cursados/estudiante/${estudianteId}`;
    const params = new URLSearchParams();
    
    if (año) params.append('año', año.toString());
    if (semestre) params.append('semestre', semestre.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await this.request<any[]>(url);
  }

  async create(data: {
    estudiante_id: string;
    codigo: string;
    nombre: string;
    creditos: number;
    // año, semestre eliminados - usar periodo_academico_estudiante_id
    periodo_academico_estudiante_id?: number;
    nota_final?: number;
    estado?: string;
    oportunidad?: number;
  }): Promise<any> {
    return this.request<any>('/ramos-cursados', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<{
    codigo: string;
    nombre: string;
    creditos: number;
    // año, semestre eliminados
    periodo_academico_estudiante_id: number;
    nota_final: number;
    estado: string;
    oportunidad: number;
  }>): Promise<any> {
    return this.request<any>(`/ramos-cursados/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`/ramos-cursados/${id}`, {
      method: 'DELETE',
    });
  }
}

export const ramosCursadosService = new RamosCursadosService();
