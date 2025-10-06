import axios from 'axios';
import type { Estudiante, FiltrosEstudiante } from '../types';
import { authService } from './authService';

const API_URL = 'http://localhost:3000';

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

export const estudianteService = {
  // Obtener todos los estudiantes
  getEstudiantes: async (): Promise<Estudiante[]> => {
    try {
      console.log('📚 Obteniendo lista de estudiantes...');
      const response = await api.get('/estudiante');
      console.log('✅ Estudiantes obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estudiantes:', error);
      throw error;
    }
  },

  // Obtener un estudiante por ID
  getEstudianteById: async (id: string): Promise<Estudiante> => {
    try {
      console.log(`👤 Obteniendo estudiante con ID: ${id}`);
      const response = await api.get(`/estudiante/${id}`);
      console.log('✅ Estudiante obtenido:', response.data.nombres);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo estudiante ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo estudiante
  crearEstudiante: async (estudiante: Omit<Estudiante, 'id'>): Promise<Estudiante> => {
    try {
      console.log('➕ Creando nuevo estudiante:', estudiante.nombres);
      const response = await api.post('/estudiante', estudiante);
      console.log('✅ Estudiante creado con ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando estudiante:', error);
      throw error;
    }
  },

  // Actualizar un estudiante
  actualizarEstudiante: async (id: string, estudiante: Partial<Estudiante>): Promise<Estudiante> => {
    try {
      console.log(`✏️ Actualizando estudiante: ${id}`);
      const response = await api.patch(`/estudiante/${id}`, estudiante);
      console.log('✅ Estudiante actualizado');
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando estudiante ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un estudiante
  eliminarEstudiante: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando estudiante: ${id}`);
      await api.delete(`/estudiante/${id}`);
      console.log('✅ Estudiante eliminado');
    } catch (error) {
      console.error(`❌ Error eliminando estudiante ${id}:`, error);
      throw error;
    }
  },

  // Buscar estudiantes con filtros
  buscarEstudiantes: async (filtros: FiltrosEstudiante): Promise<Estudiante[]> => {
    try {
      console.log('🔍 Buscando estudiantes con filtros:', filtros);
      const params = new URLSearchParams();
      
      if (filtros.nombre) params.append('nombre', filtros.nombre);
      if (filtros.rut) params.append('rut', filtros.rut);
      if (filtros.institucion) params.append('institucion', filtros.institucion);
      if (filtros.carrera) params.append('carrera', filtros.carrera);
      if (filtros.año_ingreso) params.append('año_ingreso', filtros.año_ingreso.toString());
      
      const response = await api.get(`/estudiante/buscar?${params.toString()}`);
      console.log('✅ Búsqueda completada, resultados:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error buscando estudiantes:', error);
      throw error;
    }
  },

  // Obtener estudiantes por institución
  getEstudiantesPorInstitucion: async (institucionId: string): Promise<Estudiante[]> => {
    try {
      console.log(`🏫 Obteniendo estudiantes de institución: ${institucionId}`);
      const response = await api.get(`/estudiante/institucion/${institucionId}`);
      console.log('✅ Estudiantes de institución obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo estudiantes de institución ${institucionId}:`, error);
      throw error;
    }
  },

  // Obtener estudiantes por año de ingreso
  getEstudiantesPorAño: async (año: number): Promise<Estudiante[]> => {
    try {
      console.log(`📅 Obteniendo estudiantes del año: ${año}`);
      const response = await api.get(`/estudiante/año/${año}`);
      console.log('✅ Estudiantes del año obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo estudiantes del año ${año}:`, error);
      throw error;
    }
  },

  // Activar/Desactivar estudiante
  toggleEstudianteEstado: async (id: string): Promise<Estudiante> => {
    try {
      console.log(`🔄 Cambiando estado del estudiante: ${id}`);
      const response = await api.patch(`/estudiante/${id}/toggle-estado`);
      console.log('✅ Estado del estudiante cambiado');
      return response.data;
    } catch (error) {
      console.error(`❌ Error cambiando estado del estudiante ${id}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas de estudiantes
  getEstadisticas: async () => {
    try {
      console.log('📊 Obteniendo estadísticas de estudiantes...');
      const response = await api.get('/estudiante/estadisticas');
      console.log('✅ Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Carga masiva de estudiantes
  cargaMasiva: async (archivo: File): Promise<{ exitosos: number; errores: string[] }> => {
    try {
      console.log('📂 Iniciando carga masiva de estudiantes...');
      const formData = new FormData();
      formData.append('archivo', archivo);
      
      const response = await api.post('/estudiante/carga-masiva', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Carga masiva completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en carga masiva:', error);
      throw error;
    }
  },

  // Exportar estudiantes a Excel
  exportarEstudiantes: async (filtros?: FiltrosEstudiante): Promise<Blob> => {
    try {
      console.log('📥 Exportando estudiantes...');
      const params = new URLSearchParams();
      
      if (filtros) {
        if (filtros.nombre) params.append('nombre', filtros.nombre);
        if (filtros.rut) params.append('rut', filtros.rut);
        if (filtros.institucion) params.append('institucion', filtros.institucion);
        if (filtros.carrera) params.append('carrera', filtros.carrera);
        if (filtros.año_ingreso) params.append('año_ingreso', filtros.año_ingreso.toString());
      }
      
      const response = await api.get(`/estudiante/exportar?${params.toString()}`, {
        responseType: 'blob'
      });
      
      console.log('✅ Exportación completada');
      return response.data;
    } catch (error) {
      console.error('❌ Error exportando estudiantes:', error);
      throw error;
    }
  }
};

export default estudianteService;