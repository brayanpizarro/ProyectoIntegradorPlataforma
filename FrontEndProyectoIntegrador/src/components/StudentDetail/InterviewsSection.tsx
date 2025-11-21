/**
 * Sección de entrevistas
 * Lista de entrevistas con botón para agregar nueva
 */
import React from 'react';

interface InterviewsSectionProps {
  onNuevaEntrevista: () => void;
}

export const InterviewsSection: React.FC<InterviewsSectionProps> = ({ onNuevaEntrevista }) => {
  const mockEntrevistas = [
    { fecha: '2025.05.15', tipo: 'Seguimiento Académico', observaciones: 'Buen desempeño general. Estudiante motivado.' },
    { fecha: '2025.03.10', tipo: 'Inicio de Semestre', observaciones: 'Estudiante con expectativas altas para el semestre.' },
    { fecha: '2024.12.05', tipo: 'Cierre de Semestre', observaciones: 'Excelente rendimiento. Aprobó todos los ramos.' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Entrevistas</h2>
        <button 
          onClick={onNuevaEntrevista}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          ➕ Nueva Entrevista
        </button>
      </div>

      <div className="space-y-4">
        {mockEntrevistas.map((entrevista, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{entrevista.tipo}</h3>
                <p className="text-sm text-gray-500">Fecha: {entrevista.fecha}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Completada
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Observaciones:</p>
              <p className="text-sm text-gray-600">{entrevista.observaciones}</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                👁️ Ver Detalle
              </button>
              <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mockEntrevistas.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">No hay entrevistas registradas</h3>
          <p className="text-gray-500 mb-6">
            Comienza agregando la primera entrevista del estudiante.
          </p>
          <button 
            onClick={onNuevaEntrevista}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            ➕ Agregar Primera Entrevista
          </button>
        </div>
      )}
    </div>
  );
};
