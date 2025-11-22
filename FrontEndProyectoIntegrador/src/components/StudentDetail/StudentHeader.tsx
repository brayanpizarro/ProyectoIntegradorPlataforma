/**
 * Header del detalle de estudiante
 * Muestra nombre, estado, botones de edición y volver
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getEstadoColor } from '../../utils/estadoColors';

interface StudentHeaderProps {
  nombres: string;
  apellidos: string;
  estado: string;
  modoEdicion: boolean;
  onToggleEdicion: () => void;
  onGuardar?: () => void;
  onGenerarInforme?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  nombres,
  apellidos,
  estado,
  modoEdicion,
  onToggleEdicion,
  onGuardar,
  onGenerarInforme,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-8 py-4 border-b-2 border-gray-200 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Volver
          </button>
          <h1 className="text-2xl text-gray-900 font-semibold flex items-center gap-3">
            {nombres} {apellidos}
            <span 
              className="px-3 py-1 text-white rounded-lg text-sm font-semibold"
              style={{ backgroundColor: getEstadoColor(estado) }}
            >
              {estado}
            </span>
          </h1>
        </div>
        
        <div className="flex gap-3 items-center">
          <button 
            onClick={onToggleEdicion}
            className="px-5 py-2.5 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
          >
            {modoEdicion ? '👁️ Modo Vista' : '✏️ Modo Edición'}
          </button>
          {modoEdicion && (
            <button 
              onClick={onGuardar}
              className="px-5 py-2.5 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
            >
              💾 Guardar
            </button>
          )}
          <button 
            onClick={onGenerarInforme}
            className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
          >
            📄 Generar Informe
          </button>
        </div>
      </div>
    </div>
  );
};
