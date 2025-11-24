// SERVICIO API PARA CONECTAR CON EL BACKEND REAL
// Mantiene fallback a datos mock para desarrollo y testing
// TODO Backend: Asegurar que todas estas rutas estén implementadas

import type { Estudiante, Institucion, Entrevista, EstadisticasAdmin } from '../types';

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

  // ================================
  // USUARIOS Y AUTENTICACIÓN
  // ================================

  /**
   * Obtener todos los usuarios
   * TODO Backend: Implementar endpoint de usuarios
   */
  async getUsers(): Promise<any[]> {
    try {
      const users = await this.request<any[]>('/users');
      // Mapear 'rol' del backend a 'role' del frontend
      return users.map(user => ({
        ...user,
        role: user.rol,
      }));
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos mock para usuarios');
      return this.getMockUsers();
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: string): Promise<any> {
    try {
      const user = await this.request<any>(`/users/${id}`);
      // Mapear 'rol' del backend a 'role' del frontend
      if (user && 'rol' in user) {
        user.role = user.rol;
      }
      return user;
    } catch (error) {
      console.warn(`🔄 Backend no disponible, usando mock para usuario ${id}`);
      return this.getMockUsers().find(u => u.id === id);
    }
  }

  /**
   * Crear nuevo usuario
   */
  async createUser(data: any): Promise<any> {
    try {
      const user = await this.request<any>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Mapear 'rol' del backend a 'role' del frontend
      if (user && 'rol' in user) {
        user.role = user.rol;
      }
      return user;
    } catch (error) {
      console.warn('🔄 Backend no disponible, simulando creación de usuario');
      return { ...data, id: Date.now().toString() };
    }
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id: string, data: any): Promise<any> {
    try {
      const user = await this.request<any>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      // Mapear 'rol' del backend a 'role' del frontend
      if (user && 'rol' in user) {
        user.role = user.rol;
      }
      return user;
    } catch (error) {
      console.warn(`🔄 Backend no disponible, simulando actualización de usuario ${id}`);
      return { ...data, id };
    }
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(id: string): Promise<void> {
    try {
      return await this.request<void>(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn(`🔄 Backend no disponible, simulando eliminación de usuario ${id}`);
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getCurrentUserProfile(): Promise<any> {
    try {
      const profile = await this.request<any>('/auth/profile');
      // Mapear 'rol' del backend a 'role' del frontend
      if (profile && 'rol' in profile) {
        profile.role = profile.rol;
      }
      return profile;
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos del localStorage');
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
  }

  /**
   * Actualizar perfil del usuario actual
   */
  async updateCurrentUserProfile(data: any): Promise<any> {
    try {
      const updated = await this.request<any>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      // Mapear 'rol' del backend a 'role' del frontend
      if (updated && 'rol' in updated) {
        updated.role = updated.rol;
      }
      return updated;
    } catch (error) {
      console.warn('🔄 Backend no disponible, actualizando localStorage');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  }

  // ================================
  // DATOS MOCK PARA DESARROLLO
  // ================================

  private getMockUsers(): any[] {
    return [
      {
        id: '1',
        nombres: 'Admin',
        apellidos: 'Sistema',
        email: 'admin@fundacion.cl',
        tipo: 'admin',
        role: 'admin',
        rut: '12.345.678-9',
        telefono: '+56912345678',
        activo: true,
        fecha_creacion: new Date().toISOString(),
      },
      {
        id: '2',
        nombres: 'María',
        apellidos: 'González',
        email: 'maria.gonzalez@fundacion.cl',
        tipo: 'tutor',
        role: 'tutor',
        rut: '98.765.432-1',
        telefono: '+56987654321',
        activo: true,
        creado_por: '1',
        fecha_creacion: new Date().toISOString(),
      },
      {
        id: '3',
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@fundacion.cl',
        tipo: 'invitado',
        role: 'invitado',
        rut: '11.222.333-4',
        telefono: '+56911222333',
        activo: true,
        creado_por: '1',
        fecha_creacion: new Date().toISOString(),
      },
    ];
  }

  private getMockEstudiantes(): Estudiante[] {
    return [
      {
        id_estudiante: '1',
        nombre: 'Juan Pérez González',
        rut: '12.345.678-9',
        telefono: '+56912345678',
        fecha_de_nacimiento: new Date('2000-01-01'),
        email: 'juan.perez@test.com',
        tipo_de_estudiante: 'universitario',

        // Campos de compatibilidad para frontend actual
        id: 1,
        nombres: 'Juan',
        apellidos: 'Pérez González',
        estado: 'Activo',
        año_generacion: 2024,
        carrera: 'Ingeniería Civil',
        universidad: 'Universidad de Chile',
        promedio: 78.5,
        beca: 'Beca Completa',

        institucion: {
          id_institucion: '1',
          nombre: 'Universidad de Chile',
          tipo_institucion: 'Universidad',
          nivel_educativo: 'Superior',
          carrera_especialidad: 'Ingeniería Civil',
          anio_de_ingreso: '2024',
          anio_de_egreso: '2028',
        },
        informacionAcademica: {
          id_informacion_academica: '1',
          promedio_media: 78.5,
          via_acceso: 'PSU',
          beneficios: { tipo: 'Beca Completa', monto: 1000000 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante,
        },
      },
      {
        id_estudiante: '2',
        nombre: 'María García López',
        rut: '98.765.432-1',
        telefono: '+56987654321',
        fecha_de_nacimiento: new Date('1999-05-15'),
        email: 'maria.garcia@test.com',
        tipo_de_estudiante: 'universitario',

        // Campos de compatibilidad
        id: 2,
        nombres: 'María',
        apellidos: 'García López',
        estado: 'Activo',
        año_generacion: 2024,
        carrera: 'Medicina',
        universidad: 'Pontificia Universidad Católica',
        promedio: 85.2,
        beca: 'Beca Parcial',

        institucion: {
          id_institucion: '2',
          nombre: 'Pontificia Universidad Católica',
          tipo_institucion: 'Universidad',
          nivel_educativo: 'Superior',
          carrera_especialidad: 'Medicina',
          anio_de_ingreso: '2024',
          anio_de_egreso: '2031',
        },
        informacionAcademica: {
          id_informacion_academica: '2',
          promedio_media: 85.2,
          via_acceso: 'PSU',
          beneficios: { tipo: 'Beca Parcial', monto: 500000 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante,
        },
      },
      {
        id_estudiante: '3',
        nombre: 'Carlos Hernández Silva',
        rut: '11.222.333-4',
        telefono: '+56911222333',
        fecha_de_nacimiento: new Date('2001-03-20'),
        email: 'carlos.hernandez@test.com',
        tipo_de_estudiante: 'media',

        // Campos de compatibilidad
        id: 3,
        nombres: 'Carlos',
        apellidos: 'Hernández Silva',
        estado: 'Activo',
        año_generacion: 2023,
        carrera: 'Técnico en Electrónica',
        universidad: 'Liceo Industrial A-23',
        promedio: 72.8,
        beca: 'Sin Beca',

        institucion: {
          id_institucion: '3',
          nombre: 'Liceo Industrial A-23',
          tipo_institucion: 'Liceo',
          nivel_educativo: 'Media',
          carrera_especialidad: 'Técnico en Electrónica',
          anio_de_ingreso: '2023',
          anio_de_egreso: '2024',
        },
        informacionAcademica: {
          id_informacion_academica: '3',
          promedio_media: 72.8,
          via_acceso: 'Directo',
          beneficios: { tipo: 'Sin Beca', monto: 0 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante,
        },
      },
    ];
  }

  private getMockEstudianteById(id: string): Estudiante {
    const estudiantes = this.getMockEstudiantes();
    const estudiante = estudiantes.find(e => e.id_estudiante === id || e.id?.toString() === id);

    if (!estudiante) {
      throw new Error(`Estudiante con ID ${id} no encontrado`);
    }
  }
}

// Exportar instancia singleton
export const apiService = new ApiService();

// Exportar también la clase para testing
export { ApiService };
