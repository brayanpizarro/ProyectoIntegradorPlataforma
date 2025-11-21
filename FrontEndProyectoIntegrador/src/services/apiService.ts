// SERVICIO API PARA CONECTAR CON EL BACKEND REAL
// Mantiene fallback a datos mock para desarrollo y testing
// TODO Backend: Asegurar que todas estas rutas estén implementadas

import type { 
  Estudiante, 
  Institucion, 
  Entrevista, 
  EstadisticasAdmin
} from '../types';

// CONFIGURACIÓN
const API_BASE_URL = 'http://localhost:3000'; // TODO Backend: Configurar CORS para este origen

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Clase principal para manejo de API
 * Implementa patrón Singleton y manejo de errores centralizado
 */
class ApiService {
  
  /**
   * Método base para todas las peticiones HTTP
   * Maneja autenticación automática y errores
   */
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si está disponible
    const token = localStorage.getItem('token');
    if (token && options.requireAuth !== false) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Manejo específico de errores HTTP
        if (response.status === 401) {
          console.warn('🔐 Token expirado, redirigiendo al login');
          localStorage.removeItem('token');
          window.location.href = '/';
          throw new Error('Sesión expirada');
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
      
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ================================
  // ENTREVISTAS (MongoDB)
  // ================================

  async getEntrevistas(): Promise<Entrevista[]> {
    try {
      return await this.request<Entrevista[]>('/entrevistas');
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos mock para entrevistas');
      return [];
    }
  }

  async getEntrevistasByEstudiante(estudianteId: string): Promise<Entrevista[]> {
    try {
      return await this.request<Entrevista[]>(`/entrevistas/estudiante/${estudianteId}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, usando mock para entrevistas de ${estudianteId}`);
      throw error;
    }
  }

  async createEntrevista(data: Partial<Entrevista>): Promise<Entrevista> {
    return this.request<Entrevista>('/entrevistas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ================================
  // ESTADÍSTICAS Y DASHBOARD
  // ================================

  async getEstadisticas(): Promise<EstadisticasAdmin> {
    try {
      return await this.request<EstadisticasAdmin>('/estadisticas');
    } catch (error) {
      console.warn('🔄 Backend no disponible');
      throw error;
    }
  }

  async EstudiantesPorGeneracion(año: string): Promise<Estudiante[]> {
    try {
      return await this.request<Estudiante[]>(`/estudiante/generacion/${año}`);
    } catch (error) {
      throw error;
    }
  }

  async getEstudiantePorId(id: string) {
    try {
      return await this.request<Estudiante>(`/estudiante/${id}`);
    } catch (error) {
      throw error;
    }
  }

    async getEstudiantes(): Promise<Estudiante[]> {
    try {
      return await this.request<Estudiante[]>('/estudiantes');//quitar 's'
    } catch (error) {
      console.warn('🔄 Backend no disponible');
      throw error;
    }
  }
}


// Exportar instancia singleton
export const apiService = new ApiService();

// Exportar también la clase para testing
export { ApiService };