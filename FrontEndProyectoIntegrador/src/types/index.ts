// Tipos principales basados en las entidades del backend NestJS

export interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  tipo: 'admin' | 'academico' | 'estudiante';
  rol?: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Estudiante {
  id: number;  // Cambio: number en lugar de string
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  institucion?: { nombre_institucion: string };  // Agregado
  estado: string;  // Agregado
  año_generacion: number;  // Agregado
  carrera: string;  // Cambio: requerido
  liceo?: string;  // Agregado
  especialidad?: string;  // Agregado
  promedio_liceo?: number;  // Agregado
  universidad: string;  // Agregado
  duracion_carrera?: string;  // Agregado
  via_acceso?: string;  // Agregado
  semestre?: number;  // Agregado
  promedio: number;  // Agregado
  beca: string;  // Agregado
  region?: string;  // Agregado
  institucion_id?: string;
  año_ingreso?: number;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
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

export interface Institucion {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tipo?: string;
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
  token: string;
  usuario: Usuario;
  tipo: 'admin' | 'academico' | 'estudiante';
}

// Tipos para estadísticas y dashboard
export interface EstadisticasAdmin {
  total_usuarios: number;
  total_estudiantes: number;
  total_academicos: number;
  total_instituciones: number;
  total_asignaturas: number;
  total_reportes: number;
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