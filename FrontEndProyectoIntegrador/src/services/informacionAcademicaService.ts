import axios from 'axios';
import type { InformacionAcademica, EnsayoPaesRequest } from '../types';
import { authService } from './authService';

const API_URL = 'http://backend:3000';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const informacionAcademicaService = {
  // ✅ CRUD BÁSICO
  getInformacionesAcademicas: async (): Promise<InformacionAcademica[]> => {
    try {
      const response = await api.get('/informacion-academica');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo informaciones académicas:', error);
      throw error;
    }
  },

  getInformacionAcademicaById: async (id: number): Promise<InformacionAcademica> => {
    try {
      const response = await api.get(`/informacion-academica/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo información académica ${id}:`, error);
      throw error;
    }
  },

  getInformacionAcademicaByEstudiante: async (idEstudiante: string): Promise<InformacionAcademica> => {
    try {
      const response = await api.get(`/informacion-academica/estudiante/${idEstudiante}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo información académica del estudiante ${idEstudiante}:`, error);
      throw error;
    }
  },

  createInformacionAcademica: async (info: Partial<InformacionAcademica>): Promise<InformacionAcademica> => {
    try {
      const response = await api.post('/informacion-academica', info);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando información académica:', error);
      throw error;
    }
  },

  updateInformacionAcademica: async (id: number, info: Partial<InformacionAcademica>): Promise<InformacionAcademica> => {
    try {
      const response = await api.patch(`/informacion-academica/${id}`, info);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando información académica ${id}:`, error);
      throw error;
    }
  },

  deleteInformacionAcademica: async (id: number): Promise<void> => {
    try {
      await api.delete(`/informacion-academica/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando información académica ${id}:`, error);
      throw error;
    }
  },

  // ✅ FUNCIONALIDAD ESPECÍFICA - PROMEDIOS POR NIVEL
  updatePromedio: async (id: number, nivel: '1' | '2' | '3' | '4', promedio: number): Promise<InformacionAcademica> => {
    try {
      const response = await api.patch(`/informacion-academica/${id}/promedio/${nivel}`, {
        promedio
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando promedio ${nivel}° medio ${id}:`, error);
      throw error;
    }
  },

  // ✅ FUNCIONALIDAD INCREMENTAL - ENSAYOS PAES
  addEnsayoPaes: async (id: number, ensayo: any): Promise<InformacionAcademica> => {
    try {
      const response = await api.post(`/informacion-academica/${id}/ensayo-paes`, ensayo);
      return response.data;
    } catch (error) {
      console.error(`❌ Error agregando ensayo PAES ${id}:`, error);
      throw error;
    }
  },

  updateEnsayoPaes: async (id: number, index: number, ensayo: any): Promise<InformacionAcademica> => {
    try {
      const response = await api.patch(`/informacion-academica/${id}/ensayo-paes/${index}`, ensayo);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando ensayo PAES ${id}[${index}]:`, error);
      throw error;
    }
  },

  deleteEnsayoPaes: async (id: number, index: number): Promise<InformacionAcademica> => {
    try {
      const response = await api.delete(`/informacion-academica/${id}/ensayo-paes/${index}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando ensayo PAES ${id}[${index}]:`, error);
      throw error;
    }
  },
};