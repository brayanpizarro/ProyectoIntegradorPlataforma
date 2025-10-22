import axios from 'axios';
import type { Institucion } from '../types';
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

export const institucionService = {
  // Obtener todas las instituciones
  getInstituciones: async (): Promise<Institucion[]> => {
    try {
      console.log('🏫 Obteniendo lista de instituciones...');
      const response = await api.get('/institucion');
      console.log('✅ Instituciones obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo instituciones:', error);
      throw error;
    }
  },

  // Obtener una institución por ID
  getInstitucionById: async (id: string): Promise<Institucion> => {
    try {
      console.log(`🏢 Obteniendo institución con ID: ${id}`);
      const response = await api.get(`/institucion/${id}`);
      console.log('✅ Institución obtenida:', response.data.nombre);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo institución ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva institución
  crearInstitucion: async (institucion: Omit<Institucion, 'id'>): Promise<Institucion> => {
    try {
      console.log('➕ Creando nueva institución:', institucion.nombre);
      const response = await api.post('/institucion', institucion);
      console.log('✅ Institución creada con ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando institución:', error);
      throw error;
    }
  },

  // Actualizar una institución
  actualizarInstitucion: async (id: string, institucion: Partial<Institucion>): Promise<Institucion> => {
    try {
      console.log(`✏️ Actualizando institución: ${id}`);
      const response = await api.patch(`/institucion/${id}`, institucion);
      console.log('✅ Institución actualizada');
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando institución ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una institución
  eliminarInstitucion: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando institución: ${id}`);
      await api.delete(`/institucion/${id}`);
      console.log('✅ Institución eliminada');
    } catch (error) {
      console.error(`❌ Error eliminando institución ${id}:`, error);
      throw error;
    }
  },

  // Buscar instituciones por nombre
  buscarInstituciones: async (termino: string): Promise<Institucion[]> => {
    try {
      console.log(`🔍 Buscando instituciones con término: ${termino}`);
      const response = await api.get(`/institucion/buscar?q=${encodeURIComponent(termino)}`);
      console.log('✅ Búsqueda completada, resultados:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error buscando instituciones:', error);
      throw error;
    }
  },

  // Obtener instituciones por tipo
  getInstitucionesPorTipo: async (tipo: string): Promise<Institucion[]> => {
    try {
      console.log(`🏷️ Obteniendo instituciones de tipo: ${tipo}`);
      const response = await api.get(`/institucion/tipo/${tipo}`);
      console.log('✅ Instituciones por tipo obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo instituciones de tipo ${tipo}:`, error);
      throw error;
    }
  },

  // Activar/Desactivar institución
  toggleInstitucionEstado: async (id: string): Promise<Institucion> => {
    try {
      console.log(`🔄 Cambiando estado de la institución: ${id}`);
      const response = await api.patch(`/institucion/${id}/toggle-estado`);
      console.log('✅ Estado de la institución cambiado');
      return response.data;
    } catch (error) {
      console.error(`❌ Error cambiando estado de la institución ${id}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas de instituciones
  getEstadisticas: async () => {
    try {
      console.log('📊 Obteniendo estadísticas de instituciones...');
      const response = await api.get('/institucion/estadisticas');
      console.log('✅ Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Obtener estudiantes de una institución
  getEstudiantesInstitucion: async (id: string) => {
    try {
      console.log(`👥 Obteniendo estudiantes de institución: ${id}`);
      const response = await api.get(`/institucion/${id}/estudiantes`);
      console.log('✅ Estudiantes obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo estudiantes de institución ${id}:`, error);
      throw error;
    }
  },

  // Obtener académicos de una institución
  getAcademicosInstitucion: async (id: string) => {
    try {
      console.log(`👨‍🏫 Obteniendo académicos de institución: ${id}`);
      const response = await api.get(`/institucion/${id}/academicos`);
      console.log('✅ Académicos obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo académicos de institución ${id}:`, error);
      throw error;
    }
  },

  // Exportar instituciones a Excel
  exportarInstituciones: async (): Promise<Blob> => {
    try {
      console.log('📥 Exportando instituciones...');
      const response = await api.get('/institucion/exportar', {
        responseType: 'blob'
      });
      
      console.log('✅ Exportación completada');
      return response.data;
    } catch (error) {
      console.error('❌ Error exportando instituciones:', error);
      throw error;
    }
  }
};

export default institucionService;