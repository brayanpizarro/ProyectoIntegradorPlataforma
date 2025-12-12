/**
 * Sección de perfil del estudiante
 * Muestra avatar, información básica y resumen académico
 */
import React from 'react';
import { getEstadoColor } from '../../../utils/estadoColors';
import type { Estudiante } from '../../../types';

interface ProfileSectionProps {
  estudiante: Estudiante;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ estudiante }) => {
  return (
    <div>
      {/* Tarjeta de Perfil */}
      <div className="bg-white rounded-xl p-8 shadow-md mb-8">
        <div className="grid grid-cols-[200px_1fr] gap-8 items-start">
          {/* Avatar y Estado */}
          <div className="text-center">
            <div className="w-[180px] h-[180px] rounded-full bg-gray-200 flex items-center justify-center text-6xl text-gray-500 mb-4">
              👤
            </div>
            <div 
              className="px-4 py-2 text-white rounded-lg font-semibold text-base"
              style={{ backgroundColor: getEstadoColor(estudiante.estado || 'Activo') }}
            >
              {estudiante.estado || 'Activo'}
            </div>
          </div>

          {/* Información Principal */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Información General</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
                <p className="text-base font-semibold">{estudiante.nombre || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">RUT</p>
                <p className="text-base font-semibold">{estudiante.rut || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Correo Electrónico</p>
                <p className="text-base font-semibold">{estudiante.email || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                <p className="text-base font-semibold">{estudiante.telefono || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Universidad</p>
                <p className="text-base font-semibold">{estudiante.universidad || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Carrera</p>
                <p className="text-base font-semibold">{estudiante.carrera || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Generación</p>
                <p className="text-base font-semibold">{estudiante.generacion || estudiante.año_generacion || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tipo de Estudiante</p>
                <p className="text-base font-semibold capitalize">{estudiante.tipo_de_estudiante || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Académico */}
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Resumen Académico</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{estudiante.promedio || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">Promedio General</p>
          </div>
          <div className="text-center p-6 bg-emerald-50 rounded-lg">
            <p className="text-3xl font-bold text-emerald-600">
              {estudiante.informacionAcademica?.semestre_carrera || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-2">Semestre Actual</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{estudiante.beca || 'Sin beca'}</p>
            <p className="text-sm text-gray-600 mt-2">Beca</p>
          </div>
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">
              {estudiante.informacionAcademica?.status_actual || estudiante.estado || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-2">Estado Académico</p>
          </div>
        </div>
      </div>
    </div>
  );
};
