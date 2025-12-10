/**
 * Sección de informe académico general
 * Resumen académico y detalle por año y semestre
 */
import React from 'react';
import type { Estudiante } from '../../types';

interface AcademicReportSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
}



const mockSemestres = [
  { anio: 2021, sem: 1, nSem: 1, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2021, sem: 2, nSem: 2, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2022, sem: 1, nSem: 3, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2022, sem: 2, nSem: 4, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2023, sem: 1, nSem: 5, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2023, sem: 2, nSem: 6, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2024, sem: 1, nSem: 7, aprob: 6, reprob: 0, elim: 0, total: 6 },
  { anio: 2024, sem: 2, nSem: 8, aprob: 7, reprob: 0, elim: 0, total: 7 },
  { anio: 2025, sem: 1, nSem: 9, aprob: 0, reprob: 0, elim: 0, total: 0 },
  { anio: 2025, sem: 2, nSem: 10, aprob: 0, reprob: 0, elim: 0, total: 0 },
];

export const AcademicReportSection: React.FC<AcademicReportSectionProps> = ({ estudiante, modoEdicion }) => {
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
            <td className="bg-rose-200 text-center align-middle font-bold text-lg p-4 border border-gray-300" rowSpan={10}>
              {estudiante.nombres} {estudiante.apellidos}
            </td>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº de carrera cursada</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={1} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '1'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres finalizados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={7} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '7'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres suspendidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '0'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres de carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={10} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '10'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={43} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '43'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '0'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total eliminados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" defaultValue={0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '0'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={100.0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '100.0'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={0.0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '0.0'}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Total cursados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? <input type="number" step="0.1" defaultValue={100.0} className="w-full px-2 py-1 border border-gray-300 rounded" /> : '100.0'}
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
          {mockSemestres.map((fila, idx) => (
            <tr key={idx}>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.anio} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.anio}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.sem} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.sem}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.nSem} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.nSem}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.aprob} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.aprob}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.reprob} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.reprob}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.elim} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.elim}
              </td>
              <td className="p-2 text-center border">
                {modoEdicion ? <input type="number" defaultValue={fila.total} className="w-full px-2 py-1 border border-gray-300 rounded text-center" /> : fila.total}
              </td>
              <td className="p-2 border">
                {modoEdicion ? <input type="text" placeholder="Observaciones..." className="w-full px-2 py-1 border border-gray-300 rounded" /> : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
