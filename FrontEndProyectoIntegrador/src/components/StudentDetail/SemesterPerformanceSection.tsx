/**
 * Sección de desempeño por semestre
 * Tabla detallada de ramos con comentarios y notas
 */
import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../types';
import { apiService } from '../../services/apiService';

interface SemesterPerformanceSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}

export const SemesterPerformanceSection: React.FC<SemesterPerformanceSectionProps> = ({ estudiante, modoEdicion }) => {
  const [ramosSemestre, setRamosSemestre] = useState<any[]>([]);
  const [semestreActual, setSemestreActual] = useState({ año: 2025, semestre: 1 });
  const [loading, setLoading] = useState(false);

  // Cargar ramos del semestre actual
  useEffect(() => {
    const cargarRamosSemestre = async () => {
      if (!estudiante.id_estudiante) return;
      
      setLoading(true);
      try {
        const ramos = await apiService.getRamosCursadosByEstudiante(
          estudiante.id_estudiante.toString(),
          semestreActual.año,
          semestreActual.semestre
        );
        setRamosSemestre(ramos || []);
      } catch (error) {
        console.error('Error cargando ramos:', error);
        // Fallback con datos locales si existen
        const ramosLocales = estudiante.ramosCursados?.filter(
          r => r.año === semestreActual.año && r.semestre === semestreActual.semestre
        ) || [];
        setRamosSemestre(ramosLocales);
      } finally {
        setLoading(false);
      }
    };

    cargarRamosSemestre();
  }, [estudiante.id_estudiante, semestreActual]);

  // Helper functions para calcular estadísticas
  const calcularEstadisticas = () => {
    const total = ramosSemestre.length;
    const aprobados = ramosSemestre.filter(r => r.estado === 'aprobado' || r.estado === 'A').length;
    const reprobados = ramosSemestre.filter(r => r.estado === 'reprobado' || r.estado === 'R').length;
    const eliminados = ramosSemestre.filter(r => r.estado === 'eliminado' || r.estado === 'E').length;
    
    return { total, aprobados, reprobados, eliminados };
  };

  // Formatear notas parciales para mostrar
  const formatearNotasParciales = (notas: any) => {
    if (!notas) return '-';
    if (Array.isArray(notas)) return notas.join('; ');
    if (typeof notas === 'string') return notas;
    if (typeof notas === 'object') return Object.values(notas).join('; ');
    return String(notas);
  };

  // Determinar estado de aprobación
  const getEstadoAprobacion = (estado: string) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'aprobado' || estadoLower === 'a') return 'Aprobado';
    if (estadoLower === 'reprobado' || estadoLower === 'r') return 'Reprobado';
    if (estadoLower === 'eliminado' || estadoLower === 'e') return 'Eliminado';
    return estado || 'Sin definir';
  };

  const { total, aprobados, reprobados, eliminados } = calcularEstadisticas();
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
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[5%]">N°</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[40%]">Ramo</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[35%]">Comentarios</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[12%]">Notas parciales</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[10%]">Promedio final</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[13%]">Aprobación</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500 border">
                    Cargando ramos del semestre...
                  </td>
                </tr>
              ) : ramosSemestre.length > 0 ? (
                ramosSemestre.map((ramo, index) => (
                  <tr key={ramo.id_ramo || index}>
                    <td className="p-2 text-center border">{index + 1}</td>
                    <td className="p-2 border">
                      {modoEdicion ? (
                        <input 
                          type="text" 
                          defaultValue={ramo.nombre_ramo || ''} 
                          className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        ramo.nombre_ramo || 'Sin nombre'
                      )}
                    </td>
                    <td className="p-2 border">
                      {modoEdicion ? (
                        <textarea 
                          defaultValue={ramo.comentarios || ''}
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
                          defaultValue={formatearNotasParciales(ramo.notas_parciales)} 
                          className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                          placeholder="ej: 5.1; 3.8; 4.0"
                        />
                      ) : (
                        formatearNotasParciales(ramo.notas_parciales)
                      )}
                    </td>
                    <td className="p-2 text-center border font-semibold">
                      {modoEdicion ? (
                        <input 
                          type="number" 
                          defaultValue={ramo.promedio_final || ''} 
                          step="0.1"
                          min="1.0"
                          max="7.0"
                          className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                        />
                      ) : (
                        ramo.promedio_final ? Number(ramo.promedio_final).toFixed(1) : '-'
                      )}
                    </td>
                    <td className="p-2 text-center border">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getEstadoAprobacion(ramo.estado) === 'Aprobado' 
                          ? 'bg-green-100 text-green-800' 
                          : getEstadoAprobacion(ramo.estado) === 'Reprobado'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getEstadoAprobacion(ramo.estado)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500 border">
                    No hay ramos registrados para el semestre {semestreActual.año}/{semestreActual.semestre}S
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel de resumen */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">Resumen final ramos</h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{total}</div>
                <div className="text-sm text-gray-600 mt-1">Total inscritos</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{aprobados}</div>
                <div className="text-sm text-gray-600 mt-1">Total aprobados</div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{reprobados}</div>
                <div className="text-sm text-gray-600 mt-1">Total reprobados</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{eliminados}</div>
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
            placeholder="Agregar comentarios generales del semestre..."
            disabled={!modoEdicion}
            defaultValue={''}
          />
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 text-gray-900">Principales dificultades / desafíos</h3>
          <textarea 
            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded resize-y"
            placeholder="Agregar principales dificultades o desafíos del semestre..."
            disabled={!modoEdicion}
            defaultValue={''}
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
