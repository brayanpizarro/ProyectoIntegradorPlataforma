// Interfaces para Textos dentro de Etiquetas
export interface TextoEtiquetaInput {
  contenido: string;
  fecha: string | Date;
  contexto?: string;
}

export interface TextoEtiqueta {
  contenido: string;
  fecha: Date;
  contexto: string;
}

// Interfaces para Etiquetas
export interface EtiquetaInput {
  nombre_etiqueta: string;
  textos: TextoEtiquetaInput[];
}

export interface Etiqueta {
  nombre_etiqueta: string;
  textos: TextoEtiqueta[];
  primera_vez?: Date;
  ultima_vez?: Date;
  frecuencia: number;
}

// Interfaces para Acuerdos Pendientes
export interface AcuerdoPendiente {
  acuerdo: string;
  entrevista_origen: number;
  fecha_origen: Date;
  tutor: string;
}

// Interfaces para Temas Recurrentes
export interface TemaRecurrente {
  tema: string;
  frecuencia: number;
}

// Interfaces para Filtros de Búsqueda
export interface EntrevistaFilters {
  estudianteId?: number;
  año?: number;
  tipo_entrevista?: string;
  estado?: string;
}

// Interface para la respuesta de preparar nueva entrevista
export interface PrepararEntrevistaResponse {
  estudiante: number;
  año: number;
  numero_proxima_entrevista: number;
  total_entrevistas_previas: number;
  etiquetas_acumuladas: EtiquetaAcumulada[];
  acuerdos_pendientes: AcuerdoPendiente[];
  temas_recurrentes: TemaRecurrente[];
}

// Interface para etiquetas acumuladas en el reporte
export interface EtiquetaAcumulada {
  nombre: string;
  frecuencia: number;
  primera_vez: Date;
  ultima_vez: Date;
  textos_recientes: TextoEtiqueta[];
}

// Interfaces para Paginación
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Interfaces para Datos de Etiqueta en endpoints específicos
export interface AgregarEtiquetaData {
  nombre_etiqueta: string;
  contenido: string;
  contexto?: string;
}

// Interfaces para Estadísticas
export interface EstadisticasEstudiante {
  total_entrevistas: number;
  entrevistas_por_año: { año: number; count: number }[];
  etiquetas_mas_comunes: { etiqueta: string; frecuencia: number }[];
  duracion_promedio: number;
  ultima_entrevista: Date;
}

// Interfaces para Historial de Etiqueta
export interface HistorialEtiqueta {
  etiqueta: string;
  estudianteId: number;
  total_apariciones: number;
  primera_vez: Date;
  ultima_vez: Date;
  entrevistas: {
    fecha: Date;
    numero_entrevista: number;
    contenido: string;
    contexto?: string;
  }[];
}
