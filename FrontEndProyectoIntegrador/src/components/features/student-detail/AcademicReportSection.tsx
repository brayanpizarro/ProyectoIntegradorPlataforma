/**
 * Sección de informe académico general
 * Resumen académico y detalle por año y semestre
 */
import React, { useEffect, useMemo, useState } from 'react';
import type { Estudiante, HistorialAcademico } from '../../../types';
import { historialAcademicoService, authService, informacionAcademicaService } from '../../../services';

interface AcademicReportSectionProps {
  estudiante: Estudiante;
  modoEdicion: boolean;
  historialesExternos?: HistorialAcademico[];
}



export const AcademicReportSection: React.FC<AcademicReportSectionProps> = ({ estudiante, modoEdicion, historialesExternos }) => {
  const usuario = authService.getCurrentUser();
  const autor = useMemo(
    () => usuario?.email || (usuario as any)?.nombres || (usuario as any)?.apellidos || (usuario as any)?.id || 'usuario',
    [usuario]
  );

  const [filas, setFilas] = useState<Array<{
    id?: string | number;
    año: number | null;
    semestre: number | null;
    nSemestreCarrera: number;
    ramosAprobados: number;
    ramosReprobados: number;
    ramosEliminados: number;
    totalRamos: number;
    observaciones: string;
    promedioSemestre: number | null;
    nivelEducativo?: string;
    ultimaActualizacionPor?: string;
  }>>([]);

  const [guardandoFila, setGuardandoFila] = useState<number | null>(null);
  const [guardandoResumen, setGuardandoResumen] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState<string>('');
  const [errorGlobal, setErrorGlobal] = useState<string>('');
  const [mensajeResumen, setMensajeResumen] = useState<string>('');

  // Estado para resumen editable (manual)
  const construirResumenBase = () => {
    const resumenApi = (estudiante.informacionAcademica as any)?.resumen_semestres;
    if (resumenApi) return { ...resumenApi } as Record<string, any>;

    // fallback: calcular por defecto desde ramos/historial, pero luego el usuario puede sobrescribir
    const { aprobados, reprobados, eliminados } = calcularTotalRamos();
    const total = aprobados + reprobados + eliminados;
    const porcAprobados = total === 0 ? 0 : Number(((aprobados / total) * 100).toFixed(1));
    const porcReprobados = total === 0 ? 0 : Number(((reprobados / total) * 100).toFixed(1));
    return {
      numeroCarrera: estudiante.numero_carrera || 1,
      semestresFinalizados: historialAcademico.length,
      semestresSuspendidos: estudiante.semestres_suspendidos || 0,
      semestresCarrera: estudiante.semestres_total_carrera || 10,
      totalAprobados: aprobados,
      totalReprobados: reprobados,
      totalEliminados: eliminados,
      porcAprobados,
      porcReprobados,
      porcTotal: 100,
    } as Record<string, any>;
  };

  const [resumenManual, setResumenManual] = useState<Record<string, any>>(construirResumenBase());

  // Helper functions para calcular estadísticas académicas
  const historialAcademico: HistorialAcademico[] = (historialesExternos && historialesExternos.length > 0)
    ? historialesExternos
    : (estudiante.historialesAcademicos || []);
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
  
  // Helper para ordenar y numerar semestres de carrera
  const ordenarFilas = (items: typeof filas) => {
    return [...items]
      .filter((f) => f.año !== null && f.semestre !== null)
      .sort((a, b) => {
        if ((a.año ?? 0) !== (b.año ?? 0)) return (a.año ?? 0) - (b.año ?? 0);
        return (a.semestre ?? 0) - (b.semestre ?? 0);
      })
      .map((item, idx) => ({ ...item, nSemestreCarrera: idx + 1 }));
  };

  // Preparar datos por semestre solo con historiales (sin autogenerar duplicados)
  const prepararDatosPorSemestre = () => {
    const porPeriodo = new Map<string, typeof filas[number]>();

    historialAcademico
      .filter((historial: HistorialAcademico) => historial.año || historial.semestre)
      .forEach((historial: HistorialAcademico) => {
        const key = `${historial.año ?? 'sin-año'}-${historial.semestre ?? 'sin-sem'}`;
        if (!porPeriodo.has(key)) {
          porPeriodo.set(key, {
            id: historial.id_historial_academico,
            año: historial.año ?? null,
            semestre: historial.semestre ?? null,
            nSemestreCarrera: 0,
            ramosAprobados: historial.ramos_aprobados ?? 0,
            ramosReprobados: historial.ramos_reprobados ?? 0,
            ramosEliminados: historial.ramos_eliminados ?? 0,
            totalRamos: (historial.ramos_aprobados ?? 0) + (historial.ramos_reprobados ?? 0) + (historial.ramos_eliminados ?? 0),
            observaciones: historial.observaciones || historial.trayectoria_academica?.join(', ') || '',
            promedioSemestre: historial.promedio_semestre ?? null,
            nivelEducativo: historial.nivel_educativo,
            ultimaActualizacionPor: historial.ultima_actualizacion_por || '',
          });
        }
      });

    const ordenados = ordenarFilas(Array.from(porPeriodo.values()));

    if (ordenados.length === 0) {
      const añoActual = new Date().getFullYear();
      const semestreActual = new Date().getMonth() < 6 ? 1 : 2;
      return [{
        año: añoActual,
        semestre: semestreActual,
        nSemestreCarrera: 1,
        ramosAprobados: 0,
        ramosReprobados: 0,
        ramosEliminados: 0,
        totalRamos: 0,
        observaciones: '',
        promedioSemestre: null,
        nivelEducativo: estudiante.institucion?.nivel_educativo,
        ultimaActualizacionPor: '',
      }];
    }

    return ordenados;
  };

  useEffect(() => {
    setFilas(prepararDatosPorSemestre());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudiante, historialesExternos]);

  const handleChangeFila = (index: number, campo: string, valor: string) => {
    setFilas(prev => {
      return ordenarFilas(prev.map((fila, i) => {
        if (i !== index) return fila;

        const numeroCampos = ['año', 'semestre', 'nSemestreCarrera', 'ramosAprobados', 'ramosReprobados', 'ramosEliminados', 'totalRamos', 'promedioSemestre'];
        const nuevoValor = numeroCampos.includes(campo)
          ? (valor === '' ? null : Number(valor))
          : valor;

        const ramosAprobados = campo === 'ramosAprobados' ? (Number(valor) || 0) : fila.ramosAprobados;
        const ramosReprobados = campo === 'ramosReprobados' ? (Number(valor) || 0) : fila.ramosReprobados;
        const ramosEliminados = campo === 'ramosEliminados' ? (Number(valor) || 0) : fila.ramosEliminados;
        const totalRamos = ramosAprobados + ramosReprobados + ramosEliminados;

        return {
          ...fila,
          [campo]: nuevoValor,
          totalRamos,
        };
      }));
    });
  };

  const handleAgregarFila = () => {
    const añoActual = new Date().getFullYear();
    const semestreActual = new Date().getMonth() < 6 ? 1 : 2;
    setFilas(prev => ordenarFilas([
      ...prev,
      {
        año: añoActual,
        semestre: semestreActual,
        nSemestreCarrera: 0,
        ramosAprobados: 0,
        ramosReprobados: 0,
        ramosEliminados: 0,
        totalRamos: 0,
        observaciones: '',
        promedioSemestre: null,
        nivelEducativo: estudiante.institucion?.nivel_educativo,
        ultimaActualizacionPor: '',
      }
    ]));
  };

  const handleGuardarFila = async (index: number) => {
    const fila = filas[index];
    if (!estudiante.id_estudiante) return;
    setGuardandoFila(index);
    setMensajeGlobal('');
    setErrorGlobal('');

    try {
      const payload = {
        id_estudiante: String(estudiante.id_estudiante),
        año: fila.año,
        semestre: fila.semestre,
        nivel_educativo: fila.nivelEducativo || estudiante.institucion?.nivel_educativo || 'Superior',
        ramos_aprobados: fila.ramosAprobados,
        ramos_reprobados: fila.ramosReprobados,
        ramos_eliminados: fila.ramosEliminados,
        promedio_semestre: fila.promedioSemestre ?? 0,
        observaciones: fila.observaciones || '',
        ultima_actualizacion_por: autor,
      };

      const respuesta = await historialAcademicoService.upsert(payload);

      setFilas(prev => prev.map((f, i) => {
        if (i !== index) return f;
        const ramosAprobados = (respuesta as any)?.ramos_aprobados ?? payload.ramos_aprobados ?? 0;
        const ramosReprobados = (respuesta as any)?.ramos_reprobados ?? payload.ramos_reprobados ?? 0;
        const ramosEliminados = (respuesta as any)?.ramos_eliminados ?? payload.ramos_eliminados ?? 0;
        return {
          ...f,
          id: (respuesta as any)?.id_historial_academico || f.id,
          ramosAprobados,
          ramosReprobados,
          ramosEliminados,
          totalRamos: ramosAprobados + ramosReprobados + ramosEliminados,
          observaciones: (respuesta as any)?.observaciones ?? payload.observaciones,
          promedioSemestre: (respuesta as any)?.promedio_semestre ?? payload.promedio_semestre ?? f.promedioSemestre,
          nivelEducativo: (respuesta as any)?.nivel_educativo ?? f.nivelEducativo,
          ultimaActualizacionPor: (respuesta as any)?.ultima_actualizacion_por ?? payload.ultima_actualizacion_por,
        };
      }));

      setMensajeGlobal('Cambios guardados');
    } catch (err: any) {
      setErrorGlobal(err?.message || 'No se pudo guardar la fila');
    } finally {
      setGuardandoFila(null);
    }
  };
  
  useEffect(() => {
    // Si cambian los historiales externos o el estudiante, rehidratar el resumen solo si no se ha editado manualmente
    setResumenManual(construirResumenBase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudiante, historialesExternos]);

  const handleChangeResumen = (campo: string, valor: string) => {
    setResumenManual(prev => ({
      ...prev,
      [campo]: valor === '' ? '' : isNaN(Number(valor)) ? valor : Number(valor),
    }));
  };

  const handleGuardarResumen = async () => {
    if (!estudiante.id_estudiante) return;
    setGuardandoResumen(true);
    setMensajeResumen('');
    setErrorGlobal('');
    try {
      await informacionAcademicaService.upsertByEstudiante(String(estudiante.id_estudiante), {
        resumen_semestres: resumenManual,
        ultima_actualizacion_por: autor,
      } as any);
      setMensajeResumen('Resumen guardado');
    } catch (err: any) {
      setErrorGlobal(err?.message || 'No se pudo guardar el resumen');
    } finally {
      setGuardandoResumen(false);
    }
  };

  const datosPorSemestre = filas;
  return (
    <div>
      <div className="bg-[var(--color-turquoise)] text-white text-center font-bold text-xl py-3 mb-2">
        Informe Académico General
      </div>
      <div className="bg-yellow-200 p-2 text-center font-semibold mb-4 border border-gray-300 text-sm">
        Resumen académico
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
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.numeroCarrera ?? ''}
                  onChange={(e) => handleChangeResumen('numeroCarrera', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.numeroCarrera}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres finalizados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.semestresFinalizados ?? ''}
                  onChange={(e) => handleChangeResumen('semestresFinalizados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.semestresFinalizados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres suspendidos</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.semestresSuspendidos ?? ''}
                  onChange={(e) => handleChangeResumen('semestresSuspendidos', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.semestresSuspendidos}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Nº semestres de carrera</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.semestresCarrera ?? ''}
                  onChange={(e) => handleChangeResumen('semestresCarrera', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.semestresCarrera}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.totalAprobados ?? ''}
                  onChange={(e) => handleChangeResumen('totalAprobados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.totalAprobados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total ramos reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.totalReprobados ?? ''}
                  onChange={(e) => handleChangeResumen('totalReprobados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.totalReprobados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">Total eliminados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  value={resumenManual.totalEliminados ?? ''}
                  onChange={(e) => handleChangeResumen('totalEliminados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : resumenManual.totalEliminados}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Ramos aprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  step="0.1"
                  value={resumenManual.porcAprobados ?? ''}
                  onChange={(e) => handleChangeResumen('porcAprobados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : `${resumenManual.porcAprobados ?? 0}%`}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Reprobados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  step="0.1"
                  value={resumenManual.porcReprobados ?? ''}
                  onChange={(e) => handleChangeResumen('porcReprobados', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : `${resumenManual.porcReprobados ?? 0}%`}
            </td>
          </tr>
          <tr>
            <td className="font-bold p-2 bg-rose-200 w-[30%] border border-gray-300">% Total cursados</td>
            <td className="p-2 border border-gray-300 bg-white">
              {modoEdicion ? (
                <input
                  type="number"
                  step="0.1"
                  value={resumenManual.porcTotal ?? ''}
                  onChange={(e) => handleChangeResumen('porcTotal', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              ) : `${resumenManual.porcTotal ?? 0}%`}
            </td>
          </tr>
        </tbody>
      </table>

      {modoEdicion && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleGuardarResumen}
            disabled={guardandoResumen}
            className="px-3 py-2 bg-[var(--color-turquoise)] text-white font-bold rounded"
          >
            {guardandoResumen ? 'Guardando...' : 'Guardar resumen manual'}
          </button>
          {mensajeResumen && <span className="text-green-700 font-semibold">{mensajeResumen}</span>}
          {errorGlobal && <span className="text-red-700 font-semibold">{errorGlobal}</span>}
        </div>
      )}

      {modoEdicion && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAgregarFila}
            className="px-3 py-2 bg-[var(--color-turquoise)] text-white font-bold rounded"
          >
            Agregar fila
          </button>
        </div>
      )}

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
            {modoEdicion && (
              <th scope="col" className="bg-[var(--color-turquoise)] text-white p-3 text-left border border-gray-300">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {datosPorSemestre.length > 0 ? (
            datosPorSemestre.map((fila, idx) => (
              <tr key={idx}>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.año ?? ''}
                      onChange={(e) => handleChangeFila(idx, 'año', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : (fila.año || '-')}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.semestre ?? ''}
                      onChange={(e) => handleChangeFila(idx, 'semestre', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : (fila.semestre || '-')}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.nSemestreCarrera}
                      onChange={(e) => handleChangeFila(idx, 'nSemestreCarrera', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : fila.nSemestreCarrera}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.ramosAprobados}
                      onChange={(e) => handleChangeFila(idx, 'ramosAprobados', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : fila.ramosAprobados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.ramosReprobados}
                      onChange={(e) => handleChangeFila(idx, 'ramosReprobados', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : fila.ramosReprobados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.ramosEliminados}
                      onChange={(e) => handleChangeFila(idx, 'ramosEliminados', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : fila.ramosEliminados}
                </td>
                <td className="p-2 text-center border">
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={fila.totalRamos}
                      onChange={(e) => handleChangeFila(idx, 'totalRamos', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  ) : fila.totalRamos}
                </td>
                <td className="p-2 border">
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={fila.observaciones}
                      onChange={(e) => handleChangeFila(idx, 'observaciones', e.target.value)}
                      placeholder="Observaciones..."
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  ) : (fila.observaciones || '')}
                </td>
                {modoEdicion && (
                  <td className="p-2 text-center border">
                    <button
                      type="button"
                      onClick={() => handleGuardarFila(idx)}
                      disabled={guardandoFila === idx}
                      className="px-3 py-1 bg-[var(--color-turquoise)] text-white rounded hover:opacity-90 disabled:opacity-60"
                    >
                      {guardandoFila === idx ? 'Guardando...' : 'Guardar'}
                    </button>
                  </td>
                )}
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
      {(mensajeGlobal || errorGlobal) && (
        <div className="mt-3 text-sm">
          {mensajeGlobal && <div className="text-green-700 font-medium">{mensajeGlobal}</div>}
          {errorGlobal && <div className="text-red-700 font-medium">{errorGlobal}</div>}
        </div>
      )}
    </div>
  );
};
