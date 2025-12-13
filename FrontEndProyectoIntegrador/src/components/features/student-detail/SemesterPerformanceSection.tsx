/**
 * Sección de desempeño por semestre
 * Tabla detallada de ramos con comentarios y notas
 */
import React, { useState, useEffect } from 'react';
import type { Estudiante } from '../../../types';
import { ramosCursadosService, historialAcademicoService } from '../../../services';

interface SemesterPerformanceSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}

export const SemesterPerformanceSection: React.FC<SemesterPerformanceSectionProps> = ({ estudiante, modoEdicion }) => {
  const [ramosSemestre, setRamosSemestre] = useState<any[]>([]);
  const [semestreActual, setSemestreActual] = useState({ año: 2025, semestre: 1 });
  const [historialSemestre, setHistorialSemestre] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [semestresDisponibles, setSemestresDisponibles] = useState<{año: number, semestre: number}[]>([]);

  // Cargar todos los semestres disponibles del estudiante
  useEffect(() => {
    const cargarSemestresDisponibles = async () => {
      if (!estudiante.id_estudiante) return;
      
      try {
        // Obtener todos los ramos cursados sin filtrar por semestre
        const todosLosRamos = await ramosCursadosService.getByEstudiante(
          estudiante.id_estudiante.toString()
        );
        
        console.log('📥 Todos los ramos recibidos:', todosLosRamos);
        
        // Extraer semestres únicos
        const semestresUnicos = new Set<string>();
        todosLosRamos.forEach((ramo: any) => {
          console.log('🔍 Procesando ramo:', { 
            nombre: ramo.nombre_ramo, 
            año: ramo.año, 
            semestre: ramo.semestre 
          });
          
          // Ser más permisivo con los datos
          const año = ramo.año || new Date().getFullYear();
          const semestre = ramo.semestre || 1;
          
          semestresUnicos.add(`${año}-${semestre}`);
        });
        
        // Si no hay ramos, crear semestre por defecto
        if (semestresUnicos.size === 0) {
          console.log('⚠️ No se encontraron ramos, usando semestre por defecto');
          semestresUnicos.add(`${new Date().getFullYear()}-1`);
        }
        
        // Convertir a array y ordenar
        const semestres = Array.from(semestresUnicos)
          .map(str => {
            const [año, semestre] = str.split('-').map(Number);
            return { año, semestre };
          })
          .sort((a, b) => {
            if (a.año !== b.año) return b.año - a.año; // Años más recientes primero
            return b.semestre - a.semestre; // Semestres más recientes primero
          });
        
        setSemestresDisponibles(semestres);
        console.log('📊 Semestres disponibles encontrados:', semestres);
        
        // Establecer el semestre más reciente como actual si hay semestres disponibles
        if (semestres.length > 0) {
          setSemestreActual(semestres[0]);
        }
      } catch (error) {
        console.error('Error cargando semestres disponibles:', error);
      }
    };
    
    cargarSemestresDisponibles();
  }, [estudiante.id_estudiante]);

  // Cargar ramos y historial del semestre actual
  useEffect(() => {
    const cargarDatosSemestre = async () => {
      if (!estudiante.id_estudiante) return;
      
      setLoading(true);
      try {
        // Cargar ramos cursados
        const ramos = await ramosCursadosService.getByEstudiante(
          estudiante.id_estudiante.toString(),
          semestreActual.año,
          semestreActual.semestre
        );
        
        console.log(`📚 Ramos cargados del backend para ${semestreActual.año}/${semestreActual.semestre}:`, ramos);
        
        // El backend ya debería filtrar, pero verificamos
        if (ramos && ramos.length > 0) {
          // Mostrar todos los ramos del backend ya que deberían estar filtrados
          console.log(`✅ Usando ramos del backend (ya filtrados):`, ramos);
          setRamosSemestre(ramos);
        } else {
          // Si el backend no devuelve nada, usar datos locales
          throw new Error('No data from backend, using local fallback');
        }

        // Intentar cargar historial académico del semestre
        try {
          const historial = await historialAcademicoService.getByEstudiante(
            estudiante.id_estudiante.toString(),
            semestreActual.año,
            semestreActual.semestre
          );
          setHistorialSemestre(historial);
        } catch (historialError) {
          // Si no hay historial guardado para este semestre, usar null
          setHistorialSemestre(null);
          console.log('No hay historial guardado para este semestre');
        }
      } catch (error) {
        console.error('Error cargando datos del semestre:', error);
        
        // Fallback con datos locales con asignación inteligente de semestres
        const todosLosRamos = estudiante.ramosCursados || [];
        
        // Función para asignar semestre basándose en el nombre del ramo (lógica mejorada)
        const asignarSemestre = (nombreRamo: string, index: number) => {
          const nombre = nombreRamo.toLowerCase();
          
          // Lógica específica basada en nombres comunes
          if (nombre.includes('calculo2') || nombre.includes('cálculo2') || nombre.includes('calculo 2')) {
            return { año: 2025, semestre: 1 };
          }
          if (nombre.includes('calculo3') || nombre.includes('cálculo3') || nombre.includes('calculo 3')) {
            return { año: 2025, semestre: 2 };
          }
          if (nombre.includes('calculo1') || nombre.includes('cálculo1') || nombre.includes('calculo 1')) {
            return { año: 2024, semestre: 2 };
          }
          
          // Asignar por patrón de nombres o índice
          if (nombre.includes('matemática') || nombre.includes('álgebra')) {
            return { año: 2024, semestre: 1 };
          }
          
          if (nombre.includes('física') || nombre.includes('química')) {
            return { año: 2024, semestre: 2 };
          }
          
          if (nombre.includes('programación') || nombre.includes('informática')) {
            return { año: 2025, semestre: 1 };
          }
          
          // Si no coincide con patrones, alternar entre semestres
          return {
            año: 2025,
            semestre: (index % 2) + 1
          };
        };
        
        const ramosConSemestre = todosLosRamos.map((ramo, index) => {
          // Si ya tiene año y semestre, mantenerlos
          if (ramo.año && ramo.semestre) {
            return ramo;
          }
          
          // Si no, asignarlos basándose en el nombre
          const { año, semestre } = asignarSemestre(ramo.nombre_ramo, index);
          return {
            ...ramo,
            año: ramo.año || año,
            semestre: ramo.semestre || semestre
          };
        });
        
        // Ahora filtrar por el semestre actual
        const ramosLocales = ramosConSemestre.filter(r => 
          r.año === semestreActual.año && r.semestre === semestreActual.semestre
        );
        
        console.log(`📊 Ramos locales filtrados para ${semestreActual.año}/${semestreActual.semestre}:`, ramosLocales);
        setRamosSemestre(ramosLocales);
        setHistorialSemestre(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosSemestre();
  }, [estudiante.id_estudiante, semestreActual]);

  // Helper functions para calcular estadísticas
  const calcularEstadisticas = () => {
    // Si existe historial guardado para este semestre, usar esos datos
    if (historialSemestre) {
      return {
        total: (historialSemestre.ramos_aprobados || 0) + (historialSemestre.ramos_reprobados || 0) + (historialSemestre.ramos_eliminados || 0),
        aprobados: historialSemestre.ramos_aprobados || 0,
        reprobados: historialSemestre.ramos_reprobados || 0,
        eliminados: historialSemestre.ramos_eliminados || 0,
        promedio: historialSemestre.promedio_semestre || null
      };
    }
    
    // Si no hay historial, calcular desde los ramos actuales
    const total = ramosSemestre.length;
    const aprobados = ramosSemestre.filter(r => r.estado === 'aprobado' || r.estado === 'A').length;
    const reprobados = ramosSemestre.filter(r => r.estado === 'reprobado' || r.estado === 'R').length;
    const eliminados = ramosSemestre.filter(r => r.estado === 'eliminado' || r.estado === 'E').length;
    
    // Calcular promedio si hay ramos con notas
    const ramosConNota = ramosSemestre.filter(r => r.promedio_final && !isNaN(parseFloat(r.promedio_final)));
    const promedio = ramosConNota.length > 0 
      ? ramosConNota.reduce((sum, r) => sum + parseFloat(r.promedio_final), 0) / ramosConNota.length
      : null;
    
    return { total, aprobados, reprobados, eliminados, promedio };
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

  const { total, aprobados, reprobados, eliminados, promedio } = calcularEstadisticas();
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-2">
        Desempeño Académico por semestre
      </div>
      <div className="bg-yellow-200 p-2 text-center font-semibold mb-4 border border-gray-300 text-sm flex justify-between items-center">
        <div></div>
        <div>
          Semestre {semestreActual.año}/{semestreActual.semestre}S
        </div>
        <div className="flex gap-2">
          <select
            value={`${semestreActual.año}-${semestreActual.semestre}`}
            onChange={(e) => {
              const [año, semestre] = e.target.value.split('-').map(Number);
              console.log('🔄 Cambiando a semestre:', { año, semestre });
              setSemestreActual({ año, semestre });
            }}
            className="text-sm px-2 py-1 border border-gray-300 rounded bg-white"
          >
            {semestresDisponibles.length > 0 ? (
              semestresDisponibles.map(({ año, semestre }) => (
                <option key={`${año}-${semestre}`} value={`${año}-${semestre}`}>
                  {año}/{semestre}S
                </option>
              ))
            ) : (
              <option value={`${semestreActual.año}-${semestreActual.semestre}`}>
                {semestreActual.año}/{semestreActual.semestre}S
              </option>
            )}
          </select>
        </div>
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
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[35%]">Ramo</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[8%]">Oport.</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[27%]">Comentarios</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[10%]">Notas parciales</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[8%]">Promedio final</th>
                <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300 w-[12%]">Aprobación</th>
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
                    <td className="p-2 text-center border">
                      {modoEdicion ? (
                        <select 
                          defaultValue={ramo.oportunidad || 1}
                          className="w-full px-1.5 py-1 border border-gray-300 rounded text-sm text-center"
                        >
                          <option value={1}>1ra</option>
                          <option value={2}>2da</option>
                          <option value={3}>3ra</option>
                          <option value={4}>4ta</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (ramo.oportunidad || 1) === 1 
                            ? 'bg-blue-100 text-blue-800' 
                            : (ramo.oportunidad || 1) === 2
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(ramo.oportunidad || 1) === 1 ? '1ra' : 
                           (ramo.oportunidad || 1) === 2 ? '2da' : 
                           (ramo.oportunidad || 1) === 3 ? '3ra' : '4ta'}
                        </span>
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
            <h3 className="text-lg font-bold mb-4 text-gray-900">Resumen Semestre {semestreActual.año}/{semestreActual.semestre}S</h3>
            
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

              {promedio !== null && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{promedio.toFixed(1)}</div>
                  <div className="text-sm text-gray-600 mt-1">Promedio semestre</div>
                </div>
              )}

              {historialSemestre && (
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">📊 Datos del historial guardado</div>
                </div>
              )}
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
