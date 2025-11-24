// SERVICIO API PARA CONECTAR CON EL BACKEND REAL
// Sin fallback a datos mock - 100% dependiente del backend
import type { Estudiante, Institucion, Entrevista, EstadisticasAdmin } from '../types';

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

      const data = await response.json();
      console.log(`✅ API Success: ${endpoint}`, data);
      return data;
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

  async getUsers(): Promise<any[]> {
    const users = await this.request<any[]>('/users');
    // Mapear 'rol' del backend a 'role' del frontend
    return users.map(user => ({
      ...user,
      role: user.rol || user.role,
    }));
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.request<any>(`/users/${id}`);
    // Mapear 'rol' del backend a 'role' del frontend
    if (user && 'rol' in user) {
      user.role = user.rol;
    }
    return user;
  }

  async createUser(data: any): Promise<any> {
    const user = await this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Mapear 'rol' del backend a 'role' del frontend
    if (user && 'rol' in user) {
      user.role = user.rol;
    }
    return user;
  }

  async updateUser(id: string, data: any): Promise<any> {
    const user = await this.request<any>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    // Mapear 'rol' del backend a 'role' del frontend
    if (user && 'rol' in user) {
      user.role = user.rol;
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    return await this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentUserProfile(): Promise<any> {
    const profile = await this.request<any>('/auth/profile');
    // Mapear 'rol' del backend a 'role' del frontend
    if (profile && 'rol' in profile) {
      profile.role = profile.rol;
    }
    return profile;
  }

  async updateCurrentUserProfile(data: any): Promise<any> {
    const updated = await this.request<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    // Mapear 'rol' del backend a 'role' del frontend
    if (updated && 'rol' in updated) {
      updated.role = updated.rol;
    }
    // Actualizar también el localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...updated };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updated;
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();

// Exportar también la clase para testing
export { ApiService };
