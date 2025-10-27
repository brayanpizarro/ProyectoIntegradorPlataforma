// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://backend:3000';

// Helper para hacer peticiones HTTP
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Servicios de API - TODO: Implementar cuando el backend esté listo

export const userService = {
  // GET /api/users
  getAll: () => apiRequest('/api/users'),
  
  // POST /api/users
  create: (userData: any) => apiRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // GET /api/users/:id
  getById: (id: string) => apiRequest(`/api/users/${id}`),
  
  // PATCH /api/users/:id
  update: (id: string, userData: any) => apiRequest(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  
  // DELETE /api/users/:id
  delete: (id: string) => apiRequest(`/api/users/${id}`, {
    method: 'DELETE',
  }),
};

export const estudianteService = {
  // GET /api/estudiante
  getAll: () => apiRequest('/api/estudiante'),
  
  // POST /api/estudiante
  create: (estudianteData: any) => apiRequest('/api/estudiante', {
    method: 'POST',
    body: JSON.stringify(estudianteData),
  }),
  
  // GET /api/estudiante/:id
  getById: (id: string) => apiRequest(`/api/estudiante/${id}`),
  
  // PATCH /api/estudiante/:id
  update: (id: string, estudianteData: any) => apiRequest(`/api/estudiante/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(estudianteData),
  }),
  
  // DELETE /api/estudiante/:id
  delete: (id: string) => apiRequest(`/api/estudiante/${id}`, {
    method: 'DELETE',
  }),
};

export const institucionService = {
  // GET /api/institucion
  getAll: () => apiRequest('/api/institucion'),
  
  // POST /api/institucion
  create: (institucionData: any) => apiRequest('/api/institucion', {
    method: 'POST',
    body: JSON.stringify(institucionData),
  }),
  
  // GET /api/institucion/:id
  getById: (id: string) => apiRequest(`/api/institucion/${id}`),
  
  // PATCH /api/institucion/:id
  update: (id: string, institucionData: any) => apiRequest(`/api/institucion/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(institucionData),
  }),
  
  // DELETE /api/institucion/:id
  delete: (id: string) => apiRequest(`/api/institucion/${id}`, {
    method: 'DELETE',
  }),
};

export const academicoService = {
  // GET /api/academico
  getAll: () => apiRequest('/api/academico'),
  
  // POST /api/academico
  create: (academicoData: any) => apiRequest('/api/academico', {
    method: 'POST',
    body: JSON.stringify(academicoData),
  }),
  
  // GET /api/academico/:id
  getById: (id: string) => apiRequest(`/api/academico/${id}`),
  
  // PATCH /api/academico/:id
  update: (id: string, academicoData: any) => apiRequest(`/api/academico/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(academicoData),
  }),
  
  // DELETE /api/academico/:id
  delete: (id: string) => apiRequest(`/api/academico/${id}`, {
    method: 'DELETE',
  }),
};

export const asignaturaService = {
  // GET /api/asignatura
  getAll: () => apiRequest('/api/asignatura'),
  
  // POST /api/asignatura
  create: (asignaturaData: any) => apiRequest('/api/asignatura', {
    method: 'POST',
    body: JSON.stringify(asignaturaData),
  }),
  
  // GET /api/asignatura/:id
  getById: (id: string) => apiRequest(`/api/asignatura/${id}`),
  
  // PATCH /api/asignatura/:id
  update: (id: string, asignaturaData: any) => apiRequest(`/api/asignatura/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(asignaturaData),
  }),
  
  // DELETE /api/asignatura/:id
  delete: (id: string) => apiRequest(`/api/asignatura/${id}`, {
    method: 'DELETE',
  }),
};

export const reporteService = {
  // GET /api/reporte
  getAll: () => apiRequest('/api/reporte'),
  
  // POST /api/reporte (para entrevistas)
  create: (reporteData: any) => apiRequest('/api/reporte', {
    method: 'POST',
    body: JSON.stringify(reporteData),
  }),
  
  // GET /api/reporte/:id
  getById: (id: string) => apiRequest(`/api/reporte/${id}`),
  
  // PATCH /api/reporte/:id
  update: (id: string, reporteData: any) => apiRequest(`/api/reporte/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(reporteData),
  }),
  
  // DELETE /api/reporte/:id
  delete: (id: string) => apiRequest(`/api/reporte/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios específicos para la lógica de negocio
export const generacionService = {
  // GET /api/generaciones - Obtener estudiantes agrupados por año
  getAll: () => {
    // TODO: Implementar endpoint específico para generaciones
    // Por ahora, podrías usar el servicio de estudiantes y agrupar por año
    return apiRequest('/api/generaciones');
  },
  
  // GET /api/generaciones/:año - Obtener estudiantes de un año específico
  getByYear: (año: number) => {
    return apiRequest(`/api/generaciones/${año}`);
  },
  
  // POST /api/generaciones - Crear nueva generación
  create: (generacionData: { año: number }) => {
    return apiRequest('/api/generaciones', {
      method: 'POST',
      body: JSON.stringify(generacionData),
    });
  },
};

export const entrevistaService = {
  // POST /api/entrevistas - Crear nueva entrevista (usando reportes con tipo 'entrevista')
  create: (entrevistaData: { estudianteId: string; tipo: string; contenido: any }) => {
    const reporteData = {
      ...entrevistaData,
      tipo: 'entrevista',
      fecha_generado: new Date(),
    };
    return reporteService.create(reporteData);
  },
  
  // GET /api/entrevistas/:estudianteId - Obtener entrevistas de un estudiante
  getByEstudiante: (estudianteId: string) => {
    // TODO: Implementar filtro en el backend para obtener solo reportes tipo 'entrevista'
    return apiRequest(`/api/reporte?estudianteId=${estudianteId}&tipo=entrevista`);
  },
};

// Servicio de autenticación (para futuro)
export const authService = {
  // POST /api/auth/login
  login: (credentials: { email: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // POST /api/auth/logout
  logout: () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },
  
  // GET /api/auth/me - Obtener usuario actual
  getCurrentUser: () => {
    return apiRequest('/api/auth/me');
  },
};

// Exportar todos los servicios
export const api = {
  users: userService,
  estudiantes: estudianteService,
  instituciones: institucionService,
  academicos: academicoService,
  asignaturas: asignaturaService,
  reportes: reporteService,
  generaciones: generacionService,
  entrevistas: entrevistaService,
  auth: authService,
};
