import React from 'react';
import type { Estudiante } from '../../types';

interface TopNavbarProps {
  estudiante: Estudiante;
  onNavigateBack: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ estudiante, onNavigateBack }) => {
  // ✅ DATOS: Obtener información con compatibilidad híbrida
  const nombreCompleto = estudiante.nombre || 
    `${estudiante.nombres || ''} ${estudiante.apellidos || ''}`.trim();
  const carrera = estudiante.carrera || estudiante.informacionAcademica?.carrera || 'Sin especificar';
  const universidad = estudiante.universidad || 
    estudiante.institucion?.nombre_institucion || 
    'Sin especificar';

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* ✅ LADO IZQUIERDO: Logo y navegación */}
      <div className="flex items-center gap-4">
        {/* Botón volver */}
        <button
          onClick={onNavigateBack}
          className="p-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer flex items-center gap-2 text-sm text-gray-600"
        >
          ← Volver
        </button>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Entrevistas</span>
          <span>→</span>
          <span className="text-gray-800 font-medium">
            {nombreCompleto}
          </span>
        </div>
      </div>

      {/* ✅ CENTRO: Información del estudiante */}
      <div className="flex items-center gap-4 flex-1 justify-center">
        {/* Avatar del estudiante */}
        <div className="w-10 h-10 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center text-xl text-[var(--color-turquoise)]">
          👤
        </div>
        
        {/* Datos del estudiante */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            {nombreCompleto}
          </div>
          <div className="text-sm text-gray-500">
            {carrera} • {universidad}
          </div>
        </div>
      </div>

      {/* ✅ LADO DERECHO: Usuario actual y botón terminar */}
      <div className="flex items-center gap-4">
        {/* Botón Terminar Entrevista */}
        <button
          onClick={() => {
            if (window.confirm('¿Deseas terminar y guardar esta entrevista?')) {
              onNavigateBack();
            }
          }}
          className="px-5 py-2.5 bg-[var(--color-turquoise)] text-white border-none rounded-lg cursor-pointer text-sm font-semibold shadow-sm flex items-center gap-2"
        >
          ✓ Terminar Entrevista
        </button>

        {/* Indicador de sesión activa */}
        <div className="px-3 py-1 bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)] rounded-full text-xs font-medium">
          🟢 Activa
        </div>
        
        {/* Avatar del usuario actual */}
        <div className="w-8 h-8 rounded-full bg-[var(--color-turquoise)] flex items-center justify-center text-white text-sm font-medium">
          A
        </div>
        
        {/* Información del usuario */}
        <div className="text-sm">
          <div className="text-gray-800 font-medium">Admin</div>
          <div className="text-gray-500 text-xs">Entrevistador</div>
        </div>
      </div>
    </div>
  );
};