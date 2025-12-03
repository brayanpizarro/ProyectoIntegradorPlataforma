/**
 * Tarjeta individual de generación
 * Muestra año, cantidad de estudiantes y estado
 */
import React from 'react';

interface GenerationCardProps {
  año: number;
  estudiantes: number;
  activos: number;
  estado: 'activa' | 'finalizada';
  onClick: () => void;
  onAddEstudiante?: (año: number) => void;
}

export const GenerationCard: React.FC<GenerationCardProps> = ({
  año,
  estudiantes,
  activos,
  estado,
  onClick,
  onAddEstudiante,
}) => {
  const handleAddEstudiante = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEstudiante?.(año);
  };
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎓</div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              Generación {año}
            </h4>
            <p className="text-sm text-gray-500">
              Año {año}
            </p>
          </div>
        </div>

        {/* Indicador de estado */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          estado === 'activa' 
            ? 'bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)]' 
            : 'bg-[var(--color-orange)]/20 text-[var(--color-orange)]'
        }`}>
          {estado === 'activa' ? '🟢 Activa' : '🟡 Finalizada'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {estudiantes}
          </p>
          <p className="text-xs text-gray-500">
            Total Estudiantes
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--color-turquoise)]">
            {activos}
          </p>
          <p className="text-xs text-gray-500">
            Activos
          </p>
        </div>
      </div>

      {/* Botón para agregar estudiante */}
      {onAddEstudiante && (
        <button
          onClick={handleAddEstudiante}
          className="mt-4 w-full py-2 px-4 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise)]/90 transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <span>+</span>
          Agregar Estudiante
        </button>
      )}
    </div>
  );
};
