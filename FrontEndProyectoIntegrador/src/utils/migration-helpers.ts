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
export const getEstudianteEmail = (_estudiante: Estudiante): string => {
  // TODO: Llamar al servicio informacion-contacto.service.ts
  return 'No especificado';
};

export const getEstudianteTelefono = (_estudiante: Estudiante): string => {
  // TODO: Llamar al servicio informacion-contacto.service.ts
  return 'No especificado';
};

export const getEstudianteDireccion = (_estudiante: Estudiante): string => {
  // TODO: Llamar al servicio informacion-contacto.service.ts
  return 'No especificada';
};

// === ESTADO ACADÉMICO ===
export const getEstudianteStatus = (_estudiante: Estudiante): string => {
  // TODO: Llamar al servicio estado-academico.service.ts
  return 'No especificado';
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
