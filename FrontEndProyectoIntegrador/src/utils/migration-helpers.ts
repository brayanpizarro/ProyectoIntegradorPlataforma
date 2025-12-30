/**
 * MIGRATION HELPERS - FASE 1
 * 
 * Estos helpers temporales retornan valores por defecto para todos los campos
 * que fueron migrados a nuevas tablas en el backend.
 * 
 * En la FASE 2, estos helpers serán reemplazados por llamadas reales a los servicios:
 * - informacion-contacto.service.ts
 * - estado-academico.service.ts
 * - familiar.service.ts
 * - periodo-academico.service.ts
 * - informacion-admision.service.ts
 */

import type { Estudiante, Familia, RamosCursados, HistorialAcademico, InformacionAcademica } from '../types';

// === INFORMACIÓN DE CONTACTO ===
export const getEstudianteEmail = (estudiante: Estudiante): string => {
  // Verificar si existe el campo email en el objeto (cargado desde informacion_contacto)
  return (estudiante as any).email || '';
};

export const getEstudianteTelefono = (estudiante: Estudiante): string => {
  // Verificar si existe el campo telefono en el objeto (cargado desde informacion_contacto)
  return (estudiante as any).telefono || '';
};

export const getEstudianteDireccion = (estudiante: Estudiante): string => {
  // Verificar si existe el campo direccion en el objeto (cargado desde informacion_contacto)
  return (estudiante as any).direccion || '';
};

// === ESTADO ACADÉMICO ===
export const getEstudianteStatus = (estudiante: Estudiante): string => {
  // Verificar si existe el campo status en el objeto (cargado desde estado_academico)
  return (estudiante as any).status || 'Activo';
};

export const getEstudianteSemestre = (_estudiante: Estudiante): number | undefined => {
  // TODO: Llamar al servicio estado-academico.service.ts para obtener el semestre actual
  return undefined;
};

export const getEstudianteSemestresSuspendidos = (_estudiante: Estudiante): number => {
  // TODO: Llamar al servicio estado-academico.service.ts
  return 0;
};

export const getEstudianteSemestresCarrera = (_estudiante: Estudiante): number => {
  // TODO: Llamar al servicio estado-academico.service.ts
  return 10;
};

// === INFORMACIÓN FAMILIAR ===
export const getFamiliaNombreMadre = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return 'No registrada';
};

export const getFamiliaNombrePadre = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return 'No registrado';
};

export const getFamiliaHermanos = (_familia: Familia | undefined): unknown[] => {
  // TODO: Llamar al servicio familiar.service.ts
  return [];
};

export const getFamiliaOtrosFamiliares = (_familia: Familia | undefined): unknown[] => {
  // TODO: Llamar al servicio familiar.service.ts
  return [];
};

export const getFamiliaDescripcionMadre = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return '';
};

export const getFamiliaDescripcionPadre = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return '';
};

export const getFamiliaObservacionesHermanos = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return 'Sin información';
};

export const getFamiliaObservacionesOtrosFamiliares = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts
  return 'Sin información';
};

export const getFamiliaObservacionesGenerales = (_familia: Familia | undefined): string => {
  // TODO: Llamar al servicio familiar.service.ts para obtener observaciones generales
  return 'Sin observaciones';
};

// === PERIODOS ACADÉMICOS (AÑO/SEMESTRE) ===
export const getRamoSemestre = (_ramo: RamosCursados): number | undefined => {
  // TODO: Llamar al servicio periodo-academico.service.ts
  return undefined;
};

export const getRamoAño = (_ramo: RamosCursados): number | undefined => {
  // TODO: Llamar al servicio periodo-academico.service.ts
  return undefined;
};

export const getHistorialSemestre = (_historial: HistorialAcademico): number | undefined => {
  // TODO: Llamar al servicio periodo-academico.service.ts
  return undefined;
};

export const getHistorialAño = (_historial: HistorialAcademico): number | undefined => {
  // TODO: Llamar al servicio periodo-academico.service.ts
  return undefined;
};

// === INFORMACIÓN ACADÉMICA ===
export const getInformacionAcademicaPuntajesAdmision = (_infoAcademica: InformacionAcademica | undefined): Record<string, number> | undefined => {
  // TODO: Llamar al servicio informacion-admision.service.ts
  return undefined;
};

export const formatearPeriodo = (_año: number | undefined, _semestre: number | undefined): string => {
  // TODO: Usar periodo-academico.service.ts para formatear correctamente
  return 'Sin período';
};
