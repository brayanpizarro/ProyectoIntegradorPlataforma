/**
 * Grid de generaciones con mensaje de resultados vacíos
 * Muestra tarjetas de generaciones o mensaje cuando no hay resultados
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerationCard } from './GenerationCard';

interface Generacion {
  año: number;
  estudiantes: number;
  activos: number;
  estado: 'activa' | 'finalizada';
}

interface GenerationsGridProps {
  generaciones: Generacion[];
  onLimpiarFiltros: () => void;
}

export const GenerationsGrid: React.FC<GenerationsGridProps> = ({ 
  generaciones, 
  onLimpiarFiltros 
}) => {
  const navigate = useNavigate();

  // Mensaje cuando no hay resultados
  if (generaciones.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2">
          No se encontraron generaciones
        </h3>
        <p className="text-gray-500 mb-6">
          Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
        </p>
        <button
          onClick={onLimpiarFiltros}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  // Grid de generaciones
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {generaciones.map((generacion) => (
        <GenerationCard
          key={generacion.año}
          año={generacion.año}
          estudiantes={generacion.estudiantes}
          activos={generacion.activos}
          estado={generacion.estado}
          onClick={() => navigate(`/generacion/${generacion.año}`)}
        />
      ))}
    </div>
  );
};
