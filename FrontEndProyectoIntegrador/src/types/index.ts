// TIPOS COMPATIBLES CON BACKEND Y FRONTEND EXISTENTE
// Mantiene la funcionalidad del frontend actual mientras se adapta al backend real

// Tipos de usuario - Estandarizado con 'role' como propiedad principal
export interface Usuario {
  id: string;
  nombres?: string;
  apellidos?: string;
  rut?: string;
  email: string;
  role?: 'admin' | 'academico' | 'estudiante' | 'tutor' | 'invitado'; // ✅ Propiedad principal
  password?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  activo?: boolean;
  creado_por?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// ENUMS DEL BACKEND
export enum TipoEstudiante {
  MEDIA = 'media',
  UNIVERSITARIO = 'universitario',
}

export enum StatusEstudiante {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EGRESADO = 'egresado',
  RETIRADO = 'retirado',
}

// ESTUDIANTE - ESTRUCTURA HÍBRIDA: Backend real + Frontend actual
export interface Estudiante {
  // Campos del backend real (estructura principal)
  id_estudiante: string | number;  // ✅ FLEXIBLE: Backend UUID o frontend number
  nombre: string;         // ✅ Backend usa nombre completo
  rut: string;
  telefono?: string;
  fecha_de_nacimiento?: Date | string;
  email?: string;
  tipo_de_estudiante: TipoEstudiante;  // ✅ ENUM ACTUALIZADO
  generacion?: string;
  numero_carrera?: number;  // ✅ NUEVO CAMPO
  status: StatusEstudiante; // ✅ NUEVO ENUM (reemplaza 'activo' boolean)
  institucion?: Institucion;

  // Campos del frontend actual (compatibilidad)
  id?: number;            // 🔄 Para mantener compatibilidad con frontend actual
  nombres?: string;       // 🔄 Para compatibilidad - se puede derivar de 'nombre'
  apellidos?: string;     // 🔄 Para compatibilidad - se puede derivar de 'nombre'
  estado?: string;        // 🔄 Para compatibilidad con filtros actuales
  año_generacion?: number; // 🔄 Para lógica de generaciones actual
  carrera?: string;       // 🔄 Se puede derivar de institucion.carrera_especialidad
  universidad?: string;   // 🔄 Se puede derivar de institucion.nombre
  promedio?: number;      // 🔄 Se puede derivar de informacionAcademica.promedio_media
  beca?: string;          // 🔄 Se puede derivar de informacionAcademica.beneficios
  
  // Relaciones del backend (nuevas funcionalidades)

  familia?: Familia;
  ramosCursados?: RamosCursados[];
  historialesAcademicos?: HistorialAcademico[];
  informacionAcademica?: InformacionAcademica;
  
  // Campos opcionales para migración gradual
  direccion?: string;
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
  genero?: string;
  observaciones?: string;
  semestres_suspendidos?: number;
  semestres_total_carrera?: number;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// NUEVAS INTERFACES DEL BACKEND - Basadas en el schema real
// Estas interfaces extienden la funcionalidad sin romper la existente

export interface Institucion {
  id_institucion?: string;         // ✅ Campo real del backend
  nombre?: string;                 // ✅ Renombrado de nombre_institucion para simplicidad
  tipo_institucion?: string;
  nivel_educativo?: string;
  carrera_especialidad?: string;
  anio_de_ingreso?: string | number; // ✅ FLEXIBLE: string o number
  anio_de_egreso?: string;
  
  // Campos para compatibilidad con frontend actual
  id?: string;                    // 🔄 Para compatibilidad
  nombre_institucion?: string;    // 🔄 Para compatibilidad backend
  direccion?: string;
  telefono?: string;
  email?: string;
  tipo?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Familia {
  id_familia: string;
  // ✅ CAMPOS ACTUALIZADOS DEL BACKEND
  nombre_madre?: string;        // Renombrado
  descripcion_madre?: string[]; // ✅ NUEVO: Array incremental
  nombre_padre?: string;        // Renombrado
  descripcion_padre?: string[]; // ✅ NUEVO: Array incremental
  hermanos?: any[];            // ✅ FLEXIBLE
  otros_familiares?: any[];    // ✅ NUEVO CAMPO
  // Eliminado: madre_edad, padre_edad (reemplazados por descripciones)
  observaciones?: string;
  estudiante: Estudiante;
}

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
  estudiante: Estudiante;
}

export interface HistorialAcademico {
  id_historial_academico: string;
  año: number;
  semestre: number;
  nivel_educativo?: string;
  ramos_aprobados?: number;
  ramos_reprobados?: number;
  ramos_eliminados?: number;
  promedio_semestre?: number;
  trayectoria_academica?: string[]; // ✅ NUEVO: Array incremental de seguimiento
  estudiante: Estudiante;
  created_at?: Date;
  updated_at?: Date;
}

export interface InformacionAcademica {
  id_info_academico?: number;
  // ✅ PROMEDIOS INDIVIDUALES POR NIVEL
  promedio_1?: number;  // 1° medio
  promedio_2?: number;  // 2° medio
  promedio_3?: number;  // 3° medio
  promedio_4?: number;  // 4° medio
  via_acceso?: string;
  año_ingreso_beca?: number; // ✅ RENOMBRADO de ingreso_beca
  colegio?: string;
  especialidad_colegio?: string;
  comuna_colegio?: string;
  // ✅ CAMPOS JSONB FLEXIBLES
  puntajes_admision?: any;     // JSONB flexible para PAES/PSU
  ensayos_paes?: any[];        // Array JSONB flexible
  beneficios?: string;         // ✅ CAMBIADO a texto simple
  // Eliminado: status_actual (ahora en Estudiante)
  estudiante?: Estudiante;
  created_at?: Date;
  updated_at?: Date;
}

// ✅ INTERFACES AUXILIARES PARA FUNCIONALIDAD INCREMENTAL
export interface FamiliaDescripcionRequest {
  nuevaDescripcion: string;
}

export interface TrayectoriaAcademicaRequest {
  trayectoria: string;
}

export interface EnsayoPaesRequest {
  fecha: string;
  [key: string]: any; // Flexible para cualquier estructura
}
  
  // ✅ CAMPOS ADICIONALES que busca el código
  carrera?: string;
  promedio_actual?: number;
  semestre_carrera?: number;
}

// ENTREVISTAS - MongoDB Schema del backend
export interface Entrevista {
  _id: string;
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

export interface Academico {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  telefono?: string;
  direccion?: string;
  especialidad?: string;
  institucion_id?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  institucion_id?: string;
  academico_id?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion?: string;
  estudiante_id: string;
  academico_id: string;
  asignatura_id?: string;
  fecha_generacion: string;
  tipo_reporte?: string;
  contenido?: any;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Tipos para formularios y respuestas
export interface Pregunta {
  id: string;
  texto: string;
  respuestas: string[];
  editando: boolean;
  respuestaCorrecta?: number;
}

export interface Formulario {
  id?: string;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  editandoTitulo?: boolean;
  descripcion?: string;
  id_asignatura?: string;
  fecha_creacion?: string;
  fecha_termino?: string;
  publicado?: boolean;
  activo?: boolean;
}

export interface RespuestaEstudiante {
  idFormulario: number;
  respuestas: { [idPregunta: number]: string };
  fechaEnvio: string;
}

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
}

// Tipos para estadísticas y dashboard - ACTUALIZADAS PARA BACKEND
export interface EstadisticasAdmin {

  //Tipo de datos reales entregado por el backend
  generacionesTotal: number;
  estudiantesTotal: number;
  generaciones: Array<{
    generacion: string;
    total: number;
  }>;

  // Métricas básicas (mantiene compatibilidad)
  total_usuarios?: number;
  total_estudiantes?: number;
  total_academicos?: number;
  total_instituciones?: number;
  total_asignaturas?: number;
  total_reportes?: number;
  
  // Nuevas métricas del backend real
  estudiantes_por_tipo?: {
    ESCOLAR: number;
    UNIVERSITARIO: number;
    EGRESADO: number;
  };
  promedio_general?: number;
  total_entrevistas?: number;
  total_familias?: number;
}

// Tipos para filtros
export interface FiltrosEstudiante {
  nombre?: string;
  rut?: string;
  institucion?: string;
  carrera?: string;
  año_ingreso?: number;
}

export interface FiltrosReporte {
  estudiante_id?: string;
  academico_id?: string;
  asignatura_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo_reporte?: string;
}

// Tipos para la interfaz de generaciones (manteniendo compatibilidad)
export interface Generacion {
  año: number;
  estudiantes: Estudiante[];
  cantidadEstudiantes: number;
}

// Tipo para la navegación
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}