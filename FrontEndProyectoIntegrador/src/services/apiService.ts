// SERVICIO API PARA CONECTAR CON EL BACKEND REAL
// Sin fallback a datos mock - 100% dependiente del backend
import type { Estudiante, Entrevista, EstadisticasAdmin, Usuario } from '../types';

// CONFIGURACIÓN
const API_BASE_URL = 'http://localhost:3000';

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
  private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si está disponible
    const token = localStorage.getItem('accesstoken');
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
          localStorage.removeItem('accesstoken');
          window.location.href = '/';
          throw new Error('Sesión expirada');
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Verificar si hay contenido en la respuesta antes de parsear JSON
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      if (contentLength === '0' || !contentType?.includes('application/json')) {
        console.log(`✅ API Success: ${endpoint} - No content or non-JSON response`);
        return null;
      }

      try {
        const data = await response.json();
        console.log(`✅ API Success: ${endpoint}`, data);
        return data;
      } catch (parseError) {
        console.error(`❌ JSON Parse Error [${endpoint}]:`, parseError);
        const text = await response.text();
        console.error(`Raw response:`, text);
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ================================
  // ESTUDIANTES
  // ================================

  async getEstudiantes(): Promise<Estudiante[]> {
    return await this.request<Estudiante[]>('/estudiante');
  }

  async getEstudiantePorId(id: string): Promise<Estudiante> {
    return await this.request<Estudiante>(`/estudiante/${id}`);
  }

  async EstudiantesPorGeneracion(año: string): Promise<Estudiante[]> {
    return await this.request<Estudiante[]>(`/estudiante/generacion/${año}`);
  }

  async createEstudiante(estudianteData: any): Promise<Estudiante> {
    return await this.request<Estudiante>('/estudiante', {
      method: 'POST',
      body: JSON.stringify(estudianteData),
    });
  }

  // ================================
  // RAMOS CURSADOS
  // ================================

  async getRamosCursadosByEstudiante(estudianteId: string, año?: number, semestre?: number): Promise<any[]> {
    let url = `/ramos-cursados/estudiante/${estudianteId}`;
    const params = new URLSearchParams();
    
    if (año) params.append('año', año.toString());
    if (semestre) params.append('semestre', semestre.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await this.request<any[]>(url);
  }

  async createRamoCursado(ramoData: any): Promise<any> {
    return await this.request<any>('/ramos-cursados', {
      method: 'POST',
      body: JSON.stringify(ramoData),
    });
  }

  async updateRamoCursado(id: string, ramoData: any): Promise<any> {
    return await this.request<any>(`/ramos-cursados/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(ramoData),
    });
  }

  // ================================
  // ENTREVISTAS (MongoDB)
  // ================================

  async getEntrevistas(): Promise<Entrevista[]> {
    return await this.request<Entrevista[]>('/entrevistas');
  }

  async getEntrevistasByEstudiante(estudianteId: string): Promise<Entrevista[]> {
    return await this.request<Entrevista[]>(`/entrevistas/estudiante/${estudianteId}`);
  }

  async createEntrevista(data: Partial<Entrevista>): Promise<Entrevista> {
    return this.request<Entrevista>('/entrevistas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEntrevista(entrevistaId: string): Promise<Entrevista> {
    return await this.request<Entrevista>(`/entrevistas/${entrevistaId}`);
  }

  async getTextosByEntrevista(entrevistaId: string): Promise<any[]> {
    return await this.request<any[]>(`/entrevistas/${entrevistaId}/textos`);
  }

  async addTexto(entrevistaId: string, textoData: { nombre_etiqueta: string; contenido: string; contexto?: string }): Promise<any> {
    return this.request<any>(`/entrevistas/${entrevistaId}/textos`, {
      method: 'POST',
      body: JSON.stringify(textoData),
    });
  }

  // ================================
  // ESTADÍSTICAS Y DASHBOARD
  // ================================

  async getEstadisticas(): Promise<EstadisticasAdmin> {
    // El backend no tiene endpoint de estadísticas, calcular desde estudiantes
    const estudiantes = await this.getEstudiantes();
    return {
      generacionesTotal: 0,
      estudiantesTotal: estudiantes.length,
      generaciones: []
    } as EstadisticasAdmin;
  }

  // ================================
  // USUARIOS Y AUTENTICACIÓN
  // ================================

  async getUsers(): Promise<Usuario[]> {
    return await this.request<Usuario[]>('/users');
  }

  async getUserById(id: string): Promise<Usuario> {
    return await this.request<Usuario>(`/users/${id}`);
  }

  async createUser(data: Partial<Usuario>): Promise<Usuario> {
    // Convertir 'role' del frontend a 'rol' del backend
    const backendData = { ...data } as any;
    if (backendData.role) {
      backendData.rol = backendData.role;
      delete backendData.role;
    }
    return await this.request<Usuario>('/users', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateUser(id: string, data: Partial<Usuario>): Promise<Usuario> {
    // Convertir 'role' del frontend a 'rol' del backend
    const backendData = { ...data } as any;
    if (backendData.role) {
      backendData.rol = backendData.role;
      delete backendData.role;
    }
    return await this.request<Usuario>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(backendData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return await this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentUserProfile(): Promise<Usuario> {
    return await this.request<Usuario>('/auth/profile');
  }

  async updateCurrentUserProfile(data: Partial<Usuario>): Promise<Usuario> {
    const updated = await this.request<Usuario>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    // Actualizar también el localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updated;
  }

  // Métodos para Historial Académico
  async getHistorialAcademico(idEstudiante: string, año: number, semestre: number): Promise<any> {
    return await this.request<any>(`/historial-academico/estudiante/${idEstudiante}/semestre/${año}/${semestre}`);
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();

// Exportar también la clase para testing
export { ApiService };
