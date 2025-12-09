import axios from 'axios';
import type { Familia, FamiliaDescripcionRequest } from '../types';
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

export const familiaService = {
  // ✅ CRUD BÁSICO
  getFamilias: async (): Promise<Familia[]> => {
    try {
      const response = await api.get('/familia');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo familias:', error);
      throw error;
    }
  },

  getFamiliaById: async (id: number): Promise<Familia> => {
    try {
      const response = await api.get(`/familia/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo familia ${id}:`, error);
      throw error;
    }
  },

  getFamiliaByEstudiante: async (idEstudiante: string): Promise<Familia> => {
    try {
      const response = await api.get(`/familia/estudiante/${idEstudiante}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo familia del estudiante ${idEstudiante}:`, error);
      throw error;
    }
  },

  createFamilia: async (familia: Partial<Familia>): Promise<Familia> => {
    try {
      const response = await api.post('/familia', familia);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando familia:', error);
      throw error;
    }
  },

  updateFamilia: async (id: number, familia: Partial<Familia>): Promise<Familia> => {
    try {
      const response = await api.patch(`/familia/${id}`, familia);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando familia ${id}:`, error);
      throw error;
    }
  },

  deleteFamilia: async (id: number): Promise<void> => {
    try {
      await api.delete(`/familia/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando familia ${id}:`, error);
      throw error;
    }
  },

  // ✅ FUNCIONALIDAD INCREMENTAL - DESCRIPCIONES MADRE
  addDescripcionMadre: async (id: number, descripcion: string): Promise<Familia> => {
    try {
      const response = await api.patch(`/familia/${id}/descripcion-madre`, {
        nuevaDescripcion: descripcion
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error agregando descripción madre ${id}:`, error);
      throw error;
    }
  },

  updateDescripcionMadre: async (id: number, index: number, descripcion: string): Promise<Familia> => {
    try {
      const response = await api.patch(`/familia/${id}/descripcion-madre/${index}`, {
        nuevaDescripcion: descripcion
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando descripción madre ${id}[${index}]:`, error);
      throw error;
    }
  },

  deleteDescripcionMadre: async (id: number, index: number): Promise<Familia> => {
    try {
      const response = await api.delete(`/familia/${id}/descripcion-madre/${index}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando descripción madre ${id}[${index}]:`, error);
      throw error;
    }
  },

  // ✅ FUNCIONALIDAD INCREMENTAL - DESCRIPCIONES PADRE
  addDescripcionPadre: async (id: number, descripcion: string): Promise<Familia> => {
    try {
      const response = await api.patch(`/familia/${id}/descripcion-padre`, {
        nuevaDescripcion: descripcion
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error agregando descripción padre ${id}:`, error);
      throw error;
    }
  },

  updateDescripcionPadre: async (id: number, index: number, descripcion: string): Promise<Familia> => {
    try {
      const response = await api.patch(`/familia/${id}/descripcion-padre/${index}`, {
        nuevaDescripcion: descripcion
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando descripción padre ${id}[${index}]:`, error);
      throw error;
    }
  },

  deleteDescripcionPadre: async (id: number, index: number): Promise<Familia> => {
    try {
      const response = await api.delete(`/familia/${id}/descripcion-padre/${index}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando descripción padre ${id}[${index}]:`, error);
      throw error;
    }
  },
};