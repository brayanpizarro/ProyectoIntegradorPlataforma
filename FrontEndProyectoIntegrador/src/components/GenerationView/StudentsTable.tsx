import React from 'react';
import { getEstadoColor } from '../../utils/estadoColors';
import { formatDateChilean } from '../../utils/dateHelpers';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  rut: string;
  carrera: string;
  estado: 'Activo' | 'Egresado' | 'Suspendido' | 'Desertor' | 'Congelado';
  beca: string;
  universidad: string;
  promedio: number;
  ultimaEntrevista?: string;
  totalEntrevistasAno?: number;
  diasSinEntrevista?: number;
  tienePendienteNotas?: boolean;
}

interface StudentsTableProps {
  students: Estudiante[];
  sortField: keyof Estudiante;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Estudiante) => void;
  onViewDetails: (studentId: number) => void;
}

/**
 * Table component for displaying students
 * Includes sorting, status badges, and action buttons
 */
export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  sortField,
  sortDirection,
  onSort,
  onViewDetails,
}) => {
  const getSortIcon = (field: keyof Estudiante) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th 
              onClick={() => onSort('apellidos')}
              className="py-4 px-3 text-left font-bold cursor-pointer border-b-2 border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Nombre {getSortIcon('apellidos')}
            </th>
            <th 
              onClick={() => onSort('carrera')}
              className="py-4 px-3 text-left font-bold cursor-pointer border-b-2 border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Carrera {getSortIcon('carrera')}
            </th>
            <th 
              onClick={() => onSort('estado')}
              className="py-4 px-3 text-center font-bold cursor-pointer border-b-2 border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Estado {getSortIcon('estado')}
            </th>
            <th 
              onClick={() => onSort('promedio')}
              className="py-4 px-3 text-center font-bold cursor-pointer border-b-2 border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Promedio {getSortIcon('promedio')}
            </th>
            <th className="py-4 px-3 text-center font-bold border-b-2 border-gray-300 text-gray-700 min-w-[120px]">
              Última Entrevista
            </th>
            <th className="py-4 px-3 text-center font-bold border-b-2 border-gray-300 text-gray-700">
              Entrevistas (Año)
            </th>
            <th className="py-4 px-3 text-center font-bold border-b-2 border-gray-300 text-gray-700">
              Alertas
            </th>
            <th className="py-4 px-3 text-center font-bold border-b-2 border-gray-300 text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr 
              key={student.id_estudiante || student.id || index}
              className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[var(--color-turquoise)]/10 transition-colors`}
            >
              <td className="py-3 px-3 border-b border-gray-300">
                <div className="font-bold text-gray-800">
                  {student.nombre || `${student.nombres || ''} ${student.apellidos || ''}`}
                </div>
                <div className="text-xs text-gray-500">
                  {student.rut}
                </div>
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-gray-600">
                {student.carrera || student.institucion?.carrera_especialidad || 'N/A'}
                <div className="text-xs text-gray-400">
                  {student.universidad || student.institucion?.nombre || ''}
                </div>
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-center">
                <span 
                  className="px-2 py-1 rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: getEstadoColor(student.estado || 'Activo') }}
                >
                  {student.estado || 'Activo'}
                </span>
              </td>
              <td className={`py-3 px-3 border-b border-gray-300 text-center font-bold ${
                (student.promedio || 0) >= 6.0 ? 'text-[var(--color-turquoise)]' : 
                (student.promedio || 0) >= 5.5 ? 'text-[var(--color-orange)]' : 'text-[var(--color-coral-dark)]'
              }`}>
                {student.promedio ? student.promedio.toFixed(1) : 'N/A'}
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-center text-sm">
                {formatDateChilean(student.ultimaEntrevista)}
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-center font-bold">
                {student.totalEntrevistasAno || 0}
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-center">
                <div className="flex gap-1 justify-center flex-wrap">
                  {(student.diasSinEntrevista && student.diasSinEntrevista > 60) && (
                    <span 
                      className="px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300"
                      title={`${student.diasSinEntrevista} días sin entrevista`}
                    >
                      ⏰ {student.diasSinEntrevista}d
                    </span>
                  )}
                  {student.tienePendienteNotas && (
                    <span 
                      className="px-1.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300"
                      title="Pendiente de notas"
                    >
                      📝
                    </span>
                  )}
                  {!student.diasSinEntrevista || (student.diasSinEntrevista <= 60 && !student.tienePendienteNotas) ? (
                    <span className="text-gray-400 text-sm">—</span>
                  ) : null}
                </div>
              </td>
              <td className="py-3 px-3 border-b border-gray-300 text-center">
                <button
                  onClick={() => onViewDetails(student.id_estudiante || student.id)}
                  className="px-3 py-1.5 bg-[var(--color-turquoise)] text-white rounded hover:bg-[var(--color-turquoise-light)] transition-colors text-xs font-bold"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="text-7xl mb-4">📂</div>
          <h3 className="text-gray-700 mb-2 text-2xl font-bold">
            Esta generación aún no tiene estudiantes
          </h3>
          <p className="text-gray-500 text-lg">
            Haz clic en "Agregar Estudiante" para comenzar a agregar estudiantes a esta generación
          </p>
        </div>
      )}
    </div>
  );
};
