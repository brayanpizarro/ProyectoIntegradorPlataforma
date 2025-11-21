/**
 * Panel de filtros y búsqueda para el Dashboard
 * Permite buscar, filtrar y ordenar generaciones
 */
import React from 'react';

interface FilterPanelProps {
  busqueda: string;
  filtroEstado: 'todas' | 'activas' | 'finalizadas';
  ordenarPor: 'año' | 'estudiantes';
  resultadosCount: number;
  onBusquedaChange: (value: string) => void;
  onFiltroEstadoChange: (value: 'todas' | 'activas' | 'finalizadas') => void;
  onOrdenarPorChange: (value: 'año' | 'estudiantes') => void;
  onLimpiarFiltros: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  busqueda,
  filtroEstado,
  ordenarPor,
  resultadosCount,
  onBusquedaChange,
  onFiltroEstadoChange,
  onOrdenarPorChange,
  onLimpiarFiltros,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
      <h3 className="text-xl font-bold mb-4">
        🔍 Filtros y Búsqueda
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Búsqueda por año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por año:
          </label>
          <input
            type="text"
            placeholder="Ej: 2024, 2023..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado:
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => onFiltroEstadoChange(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="todas">Todas las generaciones</option>
            <option value="activas">Solo activas</option>
            <option value="finalizadas">Solo finalizadas</option>
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por:
          </label>
          <select
            value={ordenarPor}
            onChange={(e) => onOrdenarPorChange(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="año">Año (más reciente)</option>
            <option value="estudiantes">Cantidad de estudiantes</option>
          </select>
        </div>

        {/* Botón limpiar filtros */}
        <div>
          <button
            onClick={onLimpiarFiltros}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            🗑️ Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      <div className="mt-4 px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <strong>{resultadosCount}</strong> generación(es) encontrada(s)
        {busqueda && (
          <span> • Búsqueda: "{busqueda}"</span>
        )}
        {filtroEstado !== 'todas' && (
          <span> • Estado: {filtroEstado}</span>
        )}
      </div>
    </div>
  );
};
