import axios from 'axios';
import { logger } from '../config';
import type { Reporte, FiltrosReporte } from '../types';
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

export const reporteService = {
  // Obtener todos los reportes
  getReportes: async (): Promise<Reporte[]> => {
    try {
      logger.log('📊 Obteniendo lista de reportes...');
      const response = await api.get('/reporte');
      logger.log('✅ Reportes obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      logger.error('❌ Error obteniendo reportes:', error);
      throw error;
    }
  },

  // Obtener un reporte por ID
  getReporteById: async (id: string): Promise<Reporte> => {
    try {
      logger.log(`📋 Obteniendo reporte con ID: ${id}`);
      const response = await api.get(`/reporte/${id}`);
      logger.log('✅ Reporte obtenido:', response.data.titulo);
      return response.data;
    } catch (error) {
      logger.error(`❌ Error obteniendo reporte ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo reporte
  crearReporte: async (reporte: Omit<Reporte, 'id'>): Promise<Reporte> => {
    try {
      logger.log('➕ Creando nuevo reporte:', reporte.titulo);
      const response = await api.post('/reporte', reporte);
      logger.log('✅ Reporte creado con ID:', response.data.id);
      return response.data;
    } catch (error) {
      logger.error('❌ Error creando reporte:', error);
      throw error;
    }
  },

  // Actualizar un reporte
  actualizarReporte: async (id: string, reporte: Partial<Reporte>): Promise<Reporte> => {
    try {
      logger.log(`✏️ Actualizando reporte: ${id}`);
      const response = await api.patch(`/reporte/${id}`, reporte);
      logger.log('✅ Reporte actualizado');
      return response.data;
    } catch (error) {
      logger.error(`❌ Error actualizando reporte ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un reporte
  eliminarReporte: async (id: string): Promise<void> => {
    try {
      logger.log(`🗑️ Eliminando reporte: ${id}`);
      await api.delete(`/reporte/${id}`);
      logger.log('✅ Reporte eliminado');
    } catch (error) {
      logger.error(`❌ Error eliminando reporte ${id}:`, error);
      throw error;
    }
  },

  // Buscar reportes con filtros
  buscarReportes: async (filtros: FiltrosReporte): Promise<Reporte[]> => {
    try {
      logger.log('🔍 Buscando reportes con filtros:', filtros);
      const params = new URLSearchParams();
      
      if (filtros.estudiante_id) params.append('estudiante_id', filtros.estudiante_id);
      if (filtros.academico_id) params.append('academico_id', filtros.academico_id);
      if (filtros.asignatura_id) params.append('asignatura_id', filtros.asignatura_id);
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.tipo_reporte) params.append('tipo_reporte', filtros.tipo_reporte);
      
      const response = await api.get(`/reporte/buscar?${params.toString()}`);
      logger.log('✅ Búsqueda completada, resultados:', response.data.length);
      return response.data;
    } catch (error) {
      logger.error('❌ Error buscando reportes:', error);
      throw error;
    }
  },

  // Obtener reportes por estudiante
  getReportesPorEstudiante: async (estudianteId: string): Promise<Reporte[]> => {
    try {
      logger.log(`👤 Obteniendo reportes del estudiante: ${estudianteId}`);
      const response = await api.get(`/reporte/estudiante/${estudianteId}`);
      logger.log('✅ Reportes del estudiante obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      logger.error(`❌ Error obteniendo reportes del estudiante ${estudianteId}:`, error);
      throw error;
    }
  },

  // Obtener reportes por académico
  getReportesPorAcademico: async (academicoId: string): Promise<Reporte[]> => {
    try {
      logger.log(`👨‍🏫 Obteniendo reportes del académico: ${academicoId}`);
      const response = await api.get(`/reporte/academico/${academicoId}`);
      logger.log('✅ Reportes del académico obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      logger.error(`❌ Error obteniendo reportes del académico ${academicoId}:`, error);
      throw error;
    }
  },

  // Obtener reportes por asignatura
  getReportesPorAsignatura: async (asignaturaId: string): Promise<Reporte[]> => {
    try {
      logger.log(`📚 Obteniendo reportes de la asignatura: ${asignaturaId}`);
      const response = await api.get(`/reporte/asignatura/${asignaturaId}`);
      logger.log('✅ Reportes de la asignatura obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      logger.error(`❌ Error obteniendo reportes de la asignatura ${asignaturaId}:`, error);
      throw error;
    }
  },

  // Generar reporte automático
  generarReporteAutomatico: async (estudianteId: string, academicoId: string, asignaturaId?: string): Promise<Reporte> => {
    try {
      console.log('🤖 Generando reporte automático...');
      const response = await api.post('/reporte/generar-automatico', {
        estudiante_id: estudianteId,
        academico_id: academicoId,
        asignatura_id: asignaturaId
      });
      console.log('✅ Reporte automático generado:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error generando reporte automático:', error);
      throw error;
    }
  },

  // Obtener tipos de reporte disponibles
  getTiposReporte: async (): Promise<string[]> => {
    try {
      console.log('📋 Obteniendo tipos de reporte...');
      const response = await api.get('/reporte/tipos');
      console.log('✅ Tipos de reporte obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo tipos de reporte:', error);
      throw error;
    }
  },

  // Exportar reporte a PDF
  exportarReportePDF: async (id: string): Promise<Blob> => {
    try {
      console.log(`📄 Exportando reporte ${id} a PDF...`);
      const response = await api.get(`/reporte/${id}/pdf`, {
        responseType: 'blob'
      });
      
      console.log('✅ Exportación a PDF completada');
      return response.data;
    } catch (error) {
      console.error(`❌ Error exportando reporte ${id} a PDF:`, error);
      throw error;
    }
  },

  // Exportar múltiples reportes a Excel
  exportarReportesExcel: async (filtros?: FiltrosReporte): Promise<Blob> => {
    try {
      console.log('📊 Exportando reportes a Excel...');
      const params = new URLSearchParams();
      
      if (filtros) {
        if (filtros.estudiante_id) params.append('estudiante_id', filtros.estudiante_id);
        if (filtros.academico_id) params.append('academico_id', filtros.academico_id);
        if (filtros.asignatura_id) params.append('asignatura_id', filtros.asignatura_id);
        if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
        if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
        if (filtros.tipo_reporte) params.append('tipo_reporte', filtros.tipo_reporte);
      }
      
      const response = await api.get(`/reporte/exportar?${params.toString()}`, {
        responseType: 'blob'
      });
      
      console.log('✅ Exportación a Excel completada');
      return response.data;
    } catch (error) {
      console.error('❌ Error exportando reportes a Excel:', error);
      throw error;
    }
  },

  // Obtener estadísticas de reportes
  getEstadisticas: async () => {
    try {
      console.log('📊 Obteniendo estadísticas de reportes...');
      const response = await api.get('/reporte/estadisticas');
      console.log('✅ Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

export default reporteService;