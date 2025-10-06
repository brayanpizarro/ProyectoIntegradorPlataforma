import axios from 'axios';
import type { Academico } from '../types';
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

export const academicoService = {
  // Obtener todos los académicos
  getAcademicos: async (): Promise<Academico[]> => {
    try {
      console.log('👨‍🏫 Obteniendo lista de académicos...');
      const response = await api.get('/academico');
      console.log('✅ Académicos obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo académicos:', error);
      throw error;
    }
  },

  // Obtener un académico por ID
  getAcademicoById: async (id: string): Promise<Academico> => {
    try {
      console.log(`👤 Obteniendo académico con ID: ${id}`);
      const response = await api.get(`/academico/${id}`);
      console.log('✅ Académico obtenido:', response.data.nombres);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo académico ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo académico
  crearAcademico: async (academico: Omit<Academico, 'id'>): Promise<Academico> => {
    try {
      console.log('➕ Creando nuevo académico:', academico.nombres);
      const response = await api.post('/academico', academico);
      console.log('✅ Académico creado con ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando académico:', error);
      throw error;
    }
  },

  // Actualizar un académico
  actualizarAcademico: async (id: string, academico: Partial<Academico>): Promise<Academico> => {
    try {
      console.log(`✏️ Actualizando académico: ${id}`);
      const response = await api.patch(`/academico/${id}`, academico);
      console.log('✅ Académico actualizado');
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando académico ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un académico
  eliminarAcademico: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando académico: ${id}`);
      await api.delete(`/academico/${id}`);
      console.log('✅ Académico eliminado');
    } catch (error) {
      console.error(`❌ Error eliminando académico ${id}:`, error);
      throw error;
    }
  },

  // Obtener académicos por institución
  getAcademicosPorInstitucion: async (institucionId: string): Promise<Academico[]> => {
    try {
      console.log(`🏫 Obteniendo académicos de institución: ${institucionId}`);
      const response = await api.get(`/academico/institucion/${institucionId}`);
      console.log('✅ Académicos de institución obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo académicos de institución ${institucionId}:`, error);
      throw error;
    }
  },

  // Obtener académicos por especialidad
  getAcademicosPorEspecialidad: async (especialidad: string): Promise<Academico[]> => {
    try {
      console.log(`🎓 Obteniendo académicos de especialidad: ${especialidad}`);
      const response = await api.get(`/academico/especialidad/${especialidad}`);
      console.log('✅ Académicos de especialidad obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo académicos de especialidad ${especialidad}:`, error);
      throw error;
    }
  },

  // Activar/Desactivar académico
  toggleAcademicoEstado: async (id: string): Promise<Academico> => {
    try {
      console.log(`🔄 Cambiando estado del académico: ${id}`);
      const response = await api.patch(`/academico/${id}/toggle-estado`);
      console.log('✅ Estado del académico cambiado');
      return response.data;
    } catch (error) {
      console.error(`❌ Error cambiando estado del académico ${id}:`, error);
      throw error;
    }
  },

  // Buscar académicos
  buscarAcademicos: async (termino: string): Promise<Academico[]> => {
    try {
      console.log(`🔍 Buscando académicos con término: ${termino}`);
      const response = await api.get(`/academico/buscar?q=${encodeURIComponent(termino)}`);
      console.log('✅ Búsqueda completada, resultados:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error buscando académicos:', error);
      throw error;
    }
  },

  // Obtener estadísticas de académicos
  getEstadisticas: async () => {
    try {
      console.log('📊 Obteniendo estadísticas de académicos...');
      const response = await api.get('/academico/estadisticas');
      console.log('✅ Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Carga masiva de académicos
  cargaMasiva: async (archivo: File): Promise<{ exitosos: number; errores: string[] }> => {
    try {
      console.log('📂 Iniciando carga masiva de académicos...');
      const formData = new FormData();
      formData.append('archivo', archivo);
      
      const response = await api.post('/academico/carga-masiva', formData, {
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

  // Exportar académicos a Excel
  exportarAcademicos: async (): Promise<Blob> => {
    try {
      console.log('📥 Exportando académicos...');
      const response = await api.get('/academico/exportar', {
        responseType: 'blob'
      });
      
      console.log('✅ Exportación completada');
      return response.data;
    } catch (error) {
      console.error('❌ Error exportando académicos:', error);
      throw error;
    }
  }
};

export default academicoService;