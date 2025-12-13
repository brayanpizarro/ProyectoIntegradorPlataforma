// Tipos literales del backend
export type TipoEstudiante = 'media' | 'universitario';

export const TipoEstudiante = {
  MEDIA: 'media' as const,
  UNIVERSITARIO: 'universitario' as const,
};

export type StatusEstudiante = 'activo' | 'inactivo' | 'egresado' | 'retirado';

export const StatusEstudiante = {
  ACTIVO: 'activo' as const,
  INACTIVO: 'inactivo' as const,
  EGRESADO: 'egresado' as const,
  RETIRADO: 'retirado' as const,
};

// ============================================

export interface Usuario {
  id: string;
  nombres?: string;
  apellidos?: string;
  rut?: string;
  email: string;
  role?: 'admin' | 'academico' | 'estudiante' | 'tutor' | 'invitado';
  password?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  activo?: boolean;
  creado_por?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Estudiante {
  // Campos principales del backend
  id_estudiante: string | number;
  nombre: string;
  rut: string;
  telefono?: string;
  fecha_de_nacimiento?: Date | string;
  email?: string;
  genero?: string;
  direccion?: string;
  tipo_de_estudiante: TipoEstudiante;
  generacion?: string;
  numero_carrera?: number;
  status: StatusEstudiante;
  observaciones?: string;
  status_detalle?: string;
  semestres_suspendidos?: number;
  semestres_total_carrera?: number;
  
  // Relaciones
  institucion?: Institucion;
  familia?: Familia;
  ramosCursados?: RamosCursados[];
  historialesAcademicos?: HistorialAcademico[];
  informacionAcademica?: InformacionAcademica;
  
  // Campos de compatibilidad/legacy
  id?: number;
  nombres?: string;
  apellidos?: string;
  estado?: string;
  año_generacion?: number;
  carrera?: string;
  universidad?: string;
  promedio?: number;
  beca?: string;
  liceo?: string;
  especialidad?: string;
  promedio_liceo?: number;
  duracion_carrera?: string;
  via_acceso?: string;
  semestre?: number;
  region?: string;
  institucion_id?: string;
  año_ingreso?: number;
  edad?: number;
  activo?: boolean;

  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ============================================

export interface Institucion {
  id_institucion?: string;
  nombre?: string;
  tipo_institucion?: string;
  nivel_educativo?: string;
  carrera_especialidad?: string;
  duracion?: string;
  anio_de_ingreso?: string | number;
  anio_de_egreso?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  
  // Compatibilidad
  id?: string;
  nombre_institucion?: string;
  tipo?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ============================================

export interface Familia {
  id_familia: string | number;
  nombre_madre?: string;
  descripcion_madre?: string[] | string;
  nombre_padre?: string;
  descripcion_padre?: string[] | string;
  hermanos?: any[];
  otros_familiares?: any[];
  observaciones?: any;
  estudiante?: Estudiante;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================

export interface RamosCursados {
  id_ramos_cursados: string;
  semestre: number;
  año?: number;
  oportunidad?: number;
  codigo_ramo?: string;
  nombre_ramo: string;
  notas_parciales: number[];
  promedio_final: number;
  estado: string;
  comentarios?: string;
  nivel_educativo: string;
  estudiante?: Estudiante;
}

// ============================================

export interface HistorialAcademico {
  id_historial_academico: string;
  año: number;
  semestre: number;
  nivel_educativo?: string;
  ramos_aprobados?: number;
  ramos_reprobados?: number;
  ramos_eliminados?: number;
  promedio_semestre?: number;
  trayectoria_academica?: string[];
  estudiante?: Estudiante;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================

export interface InformacionAcademica {
  id_info_academico?: number;
  promedio_1?: number;
  promedio_2?: number;
  promedio_3?: number;
  promedio_4?: number;
  via_acceso?: string;
  año_ingreso_beca?: number;
  colegio?: string;
  especialidad_colegio?: string;
  comuna_colegio?: string;
  puntajes_admision?: any;
  puntajes_paes?: any;
  ensayos_paes?: any[];
  beneficios?: string;
  estudiante?: Estudiante;
  created_at?: Date;
  updated_at?: Date;
}
// ============================================

export interface Entrevista {
  id: string;
  estudianteId: string;
  usuarioId: string;
  fecha: Date;
  nombre_Tutor: string;
  año: number;
  numero_Entrevista: number;
  duracion_minutos: number;
  tipo_entrevista: string;
  estado: string;
  observaciones: string;
  temas_abordados: string[];
  etiquetas: EtiquetaEntrevista[];
}

export interface EtiquetaEntrevista {
  nombre_etiqueta: string;
  textos: TextoEtiqueta[];
  primera_vez: Date;
  ultima_vez: Date;
  frecuencia: number;
}

export interface TextoEtiqueta {
  contenido: string;
  fecha: Date;
  contexto: string;
}

// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
}

// ============================================

export interface EstadisticasAdmin {
  generacionesTotal: number;
  estudiantesTotal: number;
  generaciones: Array<{
    generacion: string;
    total: number;
  }>;
  total_usuarios?: number;
  total_estudiantes?: number;
  total_academicos?: number;
  total_instituciones?: number;
  total_asignaturas?: number;
  total_reportes?: number;
  estudiantes_por_tipo?: {
    ESCOLAR: number;
    UNIVERSITARIO: number;
    EGRESADO: number;
  };
  promedio_general?: number;
  total_entrevistas?: number;
  total_familias?: number;
}

// ============================================

export interface Generacion {
  año: number;
  estudiantes: Estudiante[];
  cantidadEstudiantes: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}