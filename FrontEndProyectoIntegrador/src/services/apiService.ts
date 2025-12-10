// =====================================
// SERVICIO API CON MOCKS PARA DESARROLLO
// =====================================
// Este archivo conecta con el backend real en http://localhost:3000
// Si el backend NO está disponible, usa DATOS MOCK automáticamente
// 
// ✅ CÓMO REMOVER LOS MOCKS CUANDO TENGAS BACKEND:
//    1. Busca los bloques: "// ▼ MOCK DATA" y "// ▲ FIN MOCK DATA"
//    2. Elimina los métodos private getMock*()
//    3. Elimina los try-catch que llaman a getMock*()
//    4. Deja solo las llamadas directas a this.request()
//
// MOCKS ACTUALMENTE ACTIVOS (eliminar cuando backend esté listo):
//   - getMockEstudiantes() - Datos de prueba para estudiantes
//   - getMockEstudianteById() - Estudiante individual
//   - getMockInstituciones() - Datos de instituciones

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
  // ESTUDIANTES - Endpoints principales
  // ================================
  
  /**
   * Obtener todos los estudiantes con sus relaciones
   * TODO Backend: Implementar en estudiante.service.ts
   */
  async getEstudiantes(): Promise<Estudiante[]> {
    try {
      return await this.request<Estudiante[]>('/estudiantes');//quitar 's'
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos mock para estudiantes');
      return this.getMockEstudiantes();
    }
  }

  /**
   * Obtener estudiante por ID con todas sus relaciones
   * TODO Backend: Incluir relaciones familia, ramosCursados, historialAcademico
   */
  async getEstudianteById(id: string): Promise<Estudiante> {
    try {
      return await this.request<Estudiante>(`/estudiante/${id}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, usando mock para estudiante ${id}`);
      return this.getMockEstudianteById(id);
    }
  }

  /**
   * Crear nuevo estudiante
   * TODO Backend: Validar DTOs y relaciones
   */
  async createEstudiante(data: Partial<Estudiante>): Promise<Estudiante> {
    return this.request<Estudiante>('/estudiante', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Actualizar estudiante
   * TODO Backend: Manejar actualizaciones de relaciones
   */
  async updateEstudiante(id: string, data: Partial<Estudiante>): Promise<Estudiante> {
    return this.request<Estudiante>(`/estudiante/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Eliminar estudiante
   * TODO Backend: Implementar soft delete y manejo de relaciones
   */
  async deleteEstudiante(id: string): Promise<void> {
    return this.request<void>(`/estudiante/${id}`, {
      method: 'DELETE',
    });
  }

  // ================================
  // INSTITUCIONES
  // ================================

  async getInstituciones(): Promise<Institucion[]> {
    try {
      return await this.request<Institucion[]>('/institucion');
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos mock para instituciones');
      return this.getMockInstituciones();
    }
  }

  async getInstitucionById(id: string): Promise<Institucion> {
    return this.request<Institucion>(`/institucion/${id}`);
  }

  // ================================
  // ENTREVISTAS (MongoDB)
  // ================================

  /**
   * Obtener todas las entrevistas
   * TODO Backend: Implementar controlador de entrevistas con MongoDB
   */
  async getEntrevistas(): Promise<Entrevista[]> {
    try {
      return await this.request<Entrevista[]>('/entrevistas');
    } catch (error) {
      console.warn('🔄 Backend no disponible, usando datos mock para entrevistas');
      return [];
    }
  }

  /**
   * Obtener entrevistas por estudiante
   * TODO Backend: Filtrar por estudianteId en MongoDB
   */
  async getEntrevistasByEstudiante(estudianteId: string): Promise<Entrevista[]> {
    try {
      return await this.request<Entrevista[]>(`/entrevistas/estudiante/${estudianteId}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, usando mock para entrevistas de ${estudianteId}`);
      return this.getMockEntrevistas(estudianteId);
    }
  }

  /**
   * Crear nueva entrevista
   * TODO Backend: Implementar schema de MongoDB con etiquetas dinámicas
   */
  async createEntrevista(data: Partial<Entrevista>): Promise<Entrevista> {
    return this.request<Entrevista>('/entrevistas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ================================
  // ESTADÍSTICAS Y DASHBOARD
  // ================================

  /**
   * Obtener estadísticas generales para el dashboard
   * TODO Backend: Implementar endpoint de estadísticas agregadas
   */
  async getEstadisticas(): Promise<EstadisticasAdmin> {
    try {
      return await this.request<EstadisticasAdmin>('/estadisticas');
    } catch (error) {
      console.warn('🔄 Backend no disponible, calculando estadísticas desde mock');
      return this.getMockEstadisticas();
    }
  }

  /**
   * Obtener estudiantes filtrados por año de ingreso (para generaciones)
   * TODO Backend: Optimizar query con filtros en base de datos
   */
  async MockEstudiantesPorGeneracion(año: string): Promise<Estudiante[]> {
    try {
      return await this.request<Estudiante[]>(`/estudiante/generacion/${año}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, filtrando mock para generación ${año}`);
      const estudiantes = await this.getEstudiantes();
      return estudiantes.filter(e => 
        e.institucion?.anio_de_ingreso === año || e.año_generacion?.toString() === año
      );
    }
  }

  async EstudiantesPorGeneracion(año: string): Promise<Estudiante[]> {
    try {
      return await this.request<Estudiante[]>(`/estudiante/generacion/${año}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, filtrando estudiantes mock para generación ${año}`);
      const estudiantes = this.getMockEstudiantes();
      return estudiantes.filter(e => 
        e.institucion?.anio_de_ingreso === año || 
        e.año_generacion?.toString() === año ||
        e.anio_de_ingreso?.toString() === año
      );
    }
  }

  async getEstudiantePorId(id: string) {
    try {
      return await this.request<Estudiante>(`/estudiante/${id}`);
    } catch (error) {
      console.warn(`🔄 Backend no disponible, buscando estudiante ${id} en mock`);
      return this.getMockEstudianteById(id);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ▼▼▼ SECCIÓN DE MOCKS PARA DESARROLLO - ELIMINAR CUANDO BACKEND ESTÉ LISTO ▼▼▼
  // ════════════════════════════════════════════════════════════════════════════
  // 
  // ESTOS MOCKS SON TEMPORALES PARA QUE EL FRONTEND FUNCIONE SIN BASE DE DATOS
  // 
  // Cuando el backend esté completamente implementado:
  //   1. Elimina todos los métodos private getMock*()
  //   2. En getEstudiantes(), getEstudianteById(), etc., elimina el try-catch
  //   3. Deja solo: return await this.request<Tipo>(endpoint)
  //
  // Mocks activos:
  //   ✓ getMockEstudiantes() - Lista de estudiantes
  //   ✓ getMockEstudianteById() - Estudiante individual
  //   ✓ getMockInstituciones() - Instituciones educativas
  //   ✓ getMockEntrevistas() - Entrevistas (MongoDB)
  //   ✓ getMockEstadisticas() - Estadísticas dashboard
  // ════════════════════════════════════════════════════════════════════════════

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
          anio_de_egreso: '2028'
        },
        informacionAcademica: {
          id_informacion_academica: '1',
          promedio_media: 78.5,
          via_acceso: 'PSU',
          beneficios: { tipo: 'Beca Completa', monto: 1000000 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante
        }
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
          anio_de_egreso: '2031'
        },
        informacionAcademica: {
          id_informacion_academica: '2',
          promedio_media: 85.2,
          via_acceso: 'PSU',
          beneficios: { tipo: 'Beca Parcial', monto: 500000 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante
        }
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
          anio_de_egreso: '2024'
        },
        informacionAcademica: {
          id_informacion_academica: '3',
          promedio_media: 72.8,
          via_acceso: 'Directo',
          beneficios: { tipo: 'Sin Beca', monto: 0 },
          status_actual: 'Activo',
          estudiante: {} as Estudiante
        }
      }
    ];
  }

  private getMockEstudianteById(id: string): Estudiante {
    const estudiantes = this.getMockEstudiantes();
    const estudiante = estudiantes.find(e => e.id_estudiante === id || e.id?.toString() === id);
    
    if (!estudiante) {
      throw new Error(`Estudiante con ID ${id} no encontrado`);
    }

    // Agregar datos completos para la vista de detalle
    return {
      ...estudiante,
      familia: {
        id_familia: '1',
        madre_nombre: 'María González',
        madre_edad: 45,
        padre_nombre: 'José Pérez',
        padre_edad: 47,
        hermanos: [
          { nombre: 'Ana Pérez', edad: 15 },
          { nombre: 'Luis Pérez', edad: 12 }
        ],
        observaciones: 'Familia muy colaborativa con el proceso educativo',
        estudiante: {} as Estudiante
      },
      ramosCursados: [
        {
          id_ramos_cursados: '1',
          semestre: 1,
          nombre_ramo: 'Cálculo I',
          notas_parciales: [70, 75, 80],
          promedio_final: 75,
          estado: 'aprobado',
          nivel_educativo: 'Universitario',
          estudiante: {} as Estudiante
        },
        {
          id_ramos_cursados: '2',
          semestre: 1,
          nombre_ramo: 'Álgebra',
          notas_parciales: [85, 82, 88],
          promedio_final: 85,
          estado: 'aprobado',
          nivel_educativo: 'Universitario',
          estudiante: {} as Estudiante
        }
      ],
      historialesAcademicos: [
        {
          id_historial_academico: '1',
          año: 2024,
          semestre: 1,
          nivel_educativo: 'Universitario',
          ramos_aprobados: 5,
          ramos_reprobados: 0,
          promedio_semestre: 78.2,
          estudiante: {} as Estudiante
        }
      ]
    };
  }

  private getMockInstituciones(): Institucion[] {
    return [
      {
        id_institucion: '1',
        nombre: 'Universidad de Chile',
        tipo_institucion: 'Universidad',
        nivel_educativo: 'Superior',
        carrera_especialidad: 'Múltiples',
        anio_de_ingreso: '2024',
        anio_de_egreso: '2028'
      },
      {
        id_institucion: '2',
        nombre: 'Pontificia Universidad Católica',
        tipo_institucion: 'Universidad',
        nivel_educativo: 'Superior',
        carrera_especialidad: 'Múltiples',
        anio_de_ingreso: '2024',
        anio_de_egreso: '2029'
      }
    ];
  }

  private getMockEntrevistas(estudianteId: string): Entrevista[] {
    return [
      {
        _id: '1',
        estudianteId,
        usuarioId: 'admin1',
        fecha: new Date('2024-01-15'),
        nombre_Tutor: 'Dr. María Silva',
        año: 2024,
        numero_Entrevista: 1,
        duracion_minutos: 45,
        tipo_entrevista: 'seguimiento',
        estado: 'completada',
        observaciones: 'Estudiante muestra buen progreso académico',
        temas_abordados: ['Rendimiento académico', 'Adaptación universitaria'],
        etiquetas: []
      }
    ];
  }

  private getMockEstadisticas(): EstadisticasAdmin {
    const estudiantes = this.getMockEstudiantes();
    
    return {
      //Para efectos del mock y mientras que aun se conecta al backend
      generacionesTotal: 0,
      estudiantesTotal: 0,
      generaciones: [],

      total_usuarios: 10,
      total_estudiantes: estudiantes.length,
      total_academicos: 5,
      total_instituciones: 3,
      total_asignaturas: 15,
      total_reportes: 25,
      estudiantes_por_tipo: {
        ESCOLAR: estudiantes.filter(e => e.tipo_de_estudiante === 'media').length,
        UNIVERSITARIO: estudiantes.filter(e => e.tipo_de_estudiante === 'universitario').length,
        EGRESADO: estudiantes.filter(e => e.tipo_de_estudiante === 'universitario').length,
      },
      promedio_general: 78.8,
      total_entrevistas: 10,
      total_familias: estudiantes.length
    };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ▲▲▲ FIN SECCIÓN DE MOCKS - ELIMINAR CUANDO BACKEND ESTÉ LISTO ▲▲▲
  // ════════════════════════════════════════════════════════════════════════════
}

// Exportar instancia singleton
export const apiService = new ApiService();

// Exportar también la clase para testing
export { ApiService };