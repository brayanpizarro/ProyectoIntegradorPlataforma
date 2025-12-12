/**
 * Sección de informe académico general
 * Resumen académico y detalle por año y semestre
 */
import React from 'react';
import type { Estudiante } from '../../../types';

interface AcademicReportSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}



export const AcademicReportSection: React.FC<AcademicReportSectionProps> = ({ estudiante, modoEdicion }) => {
  // Helper functions para calcular estadísticas académicas
  const historialAcademico = estudiante.historial_academico || estudiante.historialesAcademicos || [];
  const ramosCursados = estudiante.ramosCursados || [];
  
  // Calcular totales de ramos
  const calcularTotalRamos = () => {
    const aprobados = ramosCursados.filter(r => r.estado === 'aprobado' || r.estado === 'A').length;
    const reprobados = ramosCursados.filter(r => r.estado === 'reprobado' || r.estado === 'R').length;
    const eliminados = ramosCursados.filter(r => r.estado === 'eliminado' || r.estado === 'E').length;
    const total = aprobados + reprobados + eliminados;
    
    return { aprobados, reprobados, eliminados, total };
  };
  
  // Calcular semestres finalizados
  const calcularSemestresFinalizados = () => {
    return historialAcademico.length;
  };
  
  // Calcular porcentajes
  const calcularPorcentajes = () => {
    const { aprobados, reprobados, total } = calcularTotalRamos();
    if (total === 0) return { porcAprobados: 0, porcReprobados: 0, porcTotal: 0 };
    
    return {
      porcAprobados: ((aprobados / total) * 100).toFixed(1),
      porcReprobados: ((reprobados / total) * 100).toFixed(1),
      porcTotal: 100.0
    };
  };
  
  // Preparar datos por semestre
  const prepararDatosPorSemestre = () => {
    return historialAcademico.map((historial, index) => ({
      año: historial.año,
      semestre: historial.semestre,
      nSemestreCarrera: index + 1,
      ramosAprobados: historial.ramos_aprobados || 0,
      ramosReprobados: historial.ramos_reprobados || 0,
      ramosEliminados: historial.ramos_eliminados || 0,
      totalRamos: (historial.ramos_aprobados || 0) + (historial.ramos_reprobados || 0),
      observaciones: historial.trayectoria_academica?.join(', ') || ''
    }));
  };
  
  const { aprobados, reprobados, eliminados, total } = calcularTotalRamos();
  const { porcAprobados, porcReprobados, porcTotal } = calcularPorcentajes();
  const datosPorSemestre = prepararDatosPorSemestre();
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-2">
        Informe Académico General
      </div>
      <div className="bg-yellow-200 p-2 text-center font-semibold mb-4 border border-gray-300 text-sm">
        Resumen académico (2024/1S)
      </div>

      <table 
        className="w-full border-collapse mb-8"
        role="table"
        aria-label="Resumen académico del estudiante"
      >
        <tbody>
          <tr>
            <td className="bg-rose-200 text-center align-middle font-bold text-sm p-2 border border-gray-300 w-32" rowSpan={10}>
              {estudiante.nombre || 'Sin nombre'}
            </td>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº de carrera cursada</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={estudiante.numero_carrera || 1} className="w-full px-2 py-1 border border-gray-300 rounded" /> : (estudiante.numero_carrera || 1)}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres finalizados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={calcularSemestresFinalizados()} className="w-full px-2 py-1 border border-gray-300 rounded" /> : calcularSemestresFinalizados()}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres suspendidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={estudiante.semestres_suspendidos || 0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : (estudiante.semestres_suspendidos || 0)}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres de carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={estudiante.semestres_total_carrera || 10} className="w-full px-2 py-1 border border-gray-300 rounded" /> : (estudiante.semestres_total_carrera || 10)}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={aprobados} className="w-full px-2 py-1 border border-gray-300 rounded" /> : aprobados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={reprobados} className="w-full px-2 py-1 border border-gray-300 rounded" /> : reprobados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total eliminados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={eliminados} className="w-full px-2 py-1 border border-gray-300 rounded" /> : eliminados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={porcAprobados} className="w-full px-2 py-1 border border-gray-300 rounded" /> : `${porcAprobados}%`}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={porcReprobados} className="w-full px-2 py-1 border border-gray-300 rounded" /> : `${porcReprobados}%`}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Total cursados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={porcTotal} className="w-full px-2 py-1 border border-gray-300 rounded" /> : `${porcTotal}%`}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="text-base font-semibold mb-3 text-gray-900">Detalle por año y semestre</h3>
      <table 
        className="w-full border-collapse"
        role="table"
        aria-label="Detalle académico por año y semestre"
      >
        <thead>
          <tr>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Año</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Semestre</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Nº Semestre Carrera</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Ramos Aprobados</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Ramos Reprobados</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Ramos Eliminados</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Total Ramos</th>
            <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {datosPorSemestre.length > 0 ? (
            datosPorSemestre.map((fila, idx) => (
              <tr key={idx}>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.año} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : (fila.año || '-')}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.semestre} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : (fila.semestre || '-')}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.nSemestreCarrera} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.nSemestreCarrera}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.ramosAprobados} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.ramosAprobados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.ramosReprobados} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.ramosReprobados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.ramosEliminados} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.ramosEliminados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? <input type="number" defaultValue={fila.totalRamos} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.totalRamos}
                </td>
                <td className="p-2 border">
                  {modoEdicion ? <input type="text" defaultValue={fila.observaciones} placeholder="Observaciones..." className="w-full px-2 py-1 border border-gray-300 rounded" /> : (fila.observaciones || '')}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-center text-gray-500 border">
                No hay datos académicos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
