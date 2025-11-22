/**
 * Sección de desempeño por semestre
 * Tabla detallada de ramos con comentarios y notas
 */
import React from 'react';

interface SemesterPerformanceSectionProps {
  modoEdicion: boolean;
}



const mockRamos = [
  { num: 1, codigo: 'DER101', nombre: 'Introducción al derecho', comentarios: '2025.03.15: Buen inicio de semestre\n2025.05.10: Estudió para la prueba', parciales: '5.1; 3.8; 4.0', promedio: 4.3, aprobacion: 'Aprobado' },
  { num: 2, codigo: 'DER201', nombre: 'Derecho Civil I', comentarios: '2025.03.20: Asistencia regular', parciales: '6.0; 5.5; 6.2', promedio: 5.9, aprobacion: 'Aprobado' },
  { num: 3, codigo: 'DER202', nombre: 'Derecho Penal', comentarios: '', parciales: '4.5; 5.0; 4.8', promedio: 4.8, aprobacion: 'Aprobado' },
  { num: 4, codigo: 'DER103', nombre: 'Derecho Constitucional', comentarios: '2025.04.01: Participación activa', parciales: '5.8; 6.1; 6.0', promedio: 6.0, aprobacion: 'Aprobado' },
  { num: 5, codigo: 'FIL101', nombre: 'Filosofía del Derecho', comentarios: '', parciales: '5.0; 5.5; 5.3', promedio: 5.3, aprobacion: 'Aprobado' },
  { num: 6, codigo: 'HIS101', nombre: 'Historia del Derecho', comentarios: '', parciales: '6.2; 6.0; 6.5', promedio: 6.2, aprobacion: 'Aprobado' },
];

export const SemesterPerformanceSection: React.FC<SemesterPerformanceSectionProps> = ({ modoEdicion }) => {
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-2">
        Desempeño Académico por semestre
      </div>
      <div className="bg-yellow-200 p-2 text-center font-semibold mb-4 border border-gray-300 text-sm">
        Semestre 2025/1S
      </div>

      <div className="grid grid-cols-[2.5fr_1fr] gap-6 mb-8">
        <div>
          <table 
            className="w-full border-collapse"
            role="table"
            aria-label="Tabla de desempeño académico por ramo"
          >
            <thead>
              <tr>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[5%]">Nº</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[10%]">Código</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[15%]">Ramo</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[35%]">Comentarios</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[12%]">Notas parciales</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[10%]">Promedio final</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[13%]">Aprobación</th>
              </tr>
            </thead>
            <tbody>
              {mockRamos.map((ramo) => (
                <tr key={ramo.num}>
                  <td className="p-2 text-center border">{ramo.num}</td>
                  <td className="p-2 text-center border">
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={ramo.codigo} 
                        className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    ) : (
                      ramo.codigo
                    )}
                  </td>
                  <td className="p-2 border">
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={ramo.nombre} 
                        className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      ramo.nombre
                    )}
                  </td>
                  <td className="p-2 border">
                    {modoEdicion ? (
                      <textarea 
                        defaultValue={ramo.comentarios}
                        className="w-full min-h-[120px] px-1.5 py-1 border border-gray-300 rounded text-xs resize-y"
                        placeholder="Agregar comentarios..."
                      />
                    ) : (
                      <div className="text-xs leading-tight whitespace-pre-wrap">{ramo.comentarios || '-'}</div>
                    )}
                  </td>
                  <td className="p-2 text-center border">
                    {modoEdicion ? (
                      <input 
                        type="text" 
                        defaultValue={ramo.parciales} 
                        className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    ) : (
                      ramo.parciales
                    )}
                  </td>
                  <td className="p-2 text-center border font-semibold">
                    {modoEdicion ? (
                      <input 
                        type="number" 
                        defaultValue={ramo.promedio} 
                        step="0.1"
                        className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                      />
                    ) : (
                      ramo.promedio.toFixed(1)
                    )}
                  </td>
                  <td className="p-2 text-center border">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      ramo.aprobacion === 'Aprobado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ramo.aprobacion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel de resumen */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Resumen final ramos</h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-600 mt-1">Total inscritos</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600 mt-1">Total aprobados</div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Total reprobados</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600 mt-1">Total eliminados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloques de comentarios y análisis */}
      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Comentarios generales</h3>
          <textarea 
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded resize-y"
            placeholder="Agregar comentarios generales..."
            disabled={!modoEdicion}
            defaultValue="2025/09/04: Le cuesta organizar sus tiempos para estudiar.\n2025/10/11: Está asistiendo a apoyo psicopedagógico."
          />
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Principales dificultades / desafíos</h3>
          <textarea 
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded resize-y"
            placeholder="Agregar principales dificultades o desafíos..."
            disabled={!modoEdicion}
            defaultValue="Mantener buena asistencia a clases tempranas."
          />
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Principales aprendizajes / logros</h3>
          <textarea 
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded resize-y"
            placeholder="Agregar principales aprendizajes o logros..."
            disabled={!modoEdicion}
          />
        </div>
      </div>
    </div>
  );
};
