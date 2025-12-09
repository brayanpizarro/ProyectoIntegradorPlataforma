import axios from 'axios';
import type { HistorialAcademico, TrayectoriaAcademicaRequest } from '../types';
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

export const historialAcademicoService = {
  // ✅ CRUD BÁSICO
  getHistorialesAcademicos: async (): Promise<HistorialAcademico[]> => {
    try {
      const response = await api.get('/historial-academico');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo historiales académicos:', error);
      throw error;
    }
  },

  getHistorialAcademicoById: async (id: number): Promise<HistorialAcademico> => {
    try {
      const response = await api.get(`/historial-academico/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo historial académico ${id}:`, error);
      throw error;
    }
  },

  // ✅ CONSULTAS ESPECIALIZADAS
  getHistorialByEstudiante: async (idEstudiante: string): Promise<HistorialAcademico[]> => {
    try {
      const response = await api.get(`/historial-academico/estudiante/${idEstudiante}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo historial del estudiante ${idEstudiante}:`, error);
      throw error;
    }
  },

  getHistorialBySemestre: async (año: number, semestre: number): Promise<HistorialAcademico[]> => {
    try {
      const response = await api.get(`/historial-academico/semestre/${año}/${semestre}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo historial del semestre ${semestre}/${año}:`, error);
      throw error;
    }
  },

  createHistorialAcademico: async (historial: Partial<HistorialAcademico>): Promise<HistorialAcademico> => {
    try {
      const response = await api.post('/historial-academico', historial);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando historial académico:', error);
      throw error;
    }
  },

  updateHistorialAcademico: async (id: number, historial: Partial<HistorialAcademico>): Promise<HistorialAcademico> => {
    try {
      const response = await api.patch(`/historial-academico/${id}`, historial);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando historial académico ${id}:`, error);
      throw error;
    }
  },

  deleteHistorialAcademico: async (id: number): Promise<void> => {
    try {
      await api.delete(`/historial-academico/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando historial académico ${id}:`, error);
      throw error;
    }
  },

  // ✅ FUNCIONALIDAD INCREMENTAL - TRAYECTORIA ACADÉMICA
  addTrayectoria: async (id: number, trayectoria: string): Promise<HistorialAcademico> => {
    try {
      const response = await api.post(`/historial-academico/${id}/trayectoria`, {
        trayectoria
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error agregando trayectoria ${id}:`, error);
      throw error;
    }
  },

  updateTrayectoria: async (id: number, index: number, trayectoria: string): Promise<HistorialAcademico> => {
    try {
      const response = await api.patch(`/historial-academico/${id}/trayectoria/${index}`, {
        trayectoria
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando trayectoria ${id}[${index}]:`, error);
      throw error;
    }
  },

  deleteTrayectoria: async (id: number, index: number): Promise<HistorialAcademico> => {
    try {
      const response = await api.delete(`/historial-academico/${id}/trayectoria/${index}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando trayectoria ${id}[${index}]:`, error);
      throw error;
    }
  },
};