import React from 'react';

interface StudentFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCarrera: string;
  onCarreraChange: (value: string) => void;
  selectedEstado: string;
  onEstadoChange: (value: string) => void;
  carreras: string[];
  estados: string[];
}

/**
 * Filter panel component for students
 * Includes search by name/RUT and filters for career and status
 */
export const StudentFilterPanel: React.FC<StudentFilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedCarrera,
  onCarreraChange,
  selectedEstado,
  onEstadoChange,
  carreras,
  estados,
}) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block mb-1 font-bold text-gray-700">
          Buscar estudiante:
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nombre, apellido o RUT..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-turquoise)] focus:border-[var(--color-turquoise)] outline-none"
        />
      </div>

      <div>
        <label className="block mb-1 font-bold text-gray-700">
          Carrera:
        </label>
        <select
          value={selectedCarrera}
          onChange={(e) => onCarreraChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-turquoise)] focus:border-[var(--color-turquoise)] outline-none"
        >
          <option value="">Todas las carreras</option>
          {carreras.map(carrera => (
            <option key={carrera} value={carrera}>{carrera}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-bold text-gray-700">
          Estado:
        </label>
        <select
          value={selectedEstado}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-turquoise)] focus:border-[var(--color-turquoise)] outline-none"
        >
          <option value="">Todos los estados</option>
          {estados.map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
