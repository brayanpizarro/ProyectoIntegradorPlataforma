import { useEffect, useMemo, useState } from 'react';
import type { Estudiante } from '../../../../types';
import { ramosCursadosService, historialAcademicoService } from '../../../../services';

interface Semestre {
  año: number;
  semestre: number;
}

const defaultSemestre = (): Semestre => ({
  año: new Date().getFullYear(),
  semestre: 1,
});

export const useSemesterOptions = (estudianteId?: number | string) => {
  const [semestresDisponibles, setSemestresDisponibles] = useState<Semestre[]>([]);
  const [semestreActual, setSemestreActual] = useState<Semestre>(defaultSemestre);
  const [loadingSemestres, setLoadingSemestres] = useState(false);

  useEffect(() => {
    const cargarSemestresDisponibles = async () => {
      if (!estudianteId) return;
      setLoadingSemestres(true);
      try {
        const todosLosRamos = await ramosCursadosService.getByEstudiante(estudianteId.toString());

        const semestresUnicos = new Set<string>();
        todosLosRamos.forEach((ramo: any) => {
          const año = ramo.año || new Date().getFullYear();
          const semestre = ramo.semestre || 1;
          semestresUnicos.add(`${año}-${semestre}`);
        });

        if (semestresUnicos.size === 0) {
          semestresUnicos.add(`${new Date().getFullYear()}-1`);
        }

        const semestres = Array.from(semestresUnicos)
          .map(str => {
            const [año, semestre] = str.split('-').map(Number);
            return { año, semestre };
          })
          .sort((a, b) => {
            if (a.año !== b.año) return b.año - a.año;
            return b.semestre - a.semestre;
          });

        setSemestresDisponibles(semestres);
        if (semestres.length > 0) {
          setSemestreActual(semestres[0]);
        }
      } catch (error) {
        console.error('Error cargando semestres disponibles:', error);
      } finally {
        setLoadingSemestres(false);
      }
    };

    cargarSemestresDisponibles();
  }, [estudianteId]);

  return { semestresDisponibles, semestreActual, setSemestreActual, loadingSemestres };
};

const asignarSemestreFallback = (nombreRamo: string, index: number) => {
  const nombre = nombreRamo?.toLowerCase() || '';

  if (nombre.includes('calculo2') || nombre.includes('cálculo2') || nombre.includes('calculo 2')) {
    return { año: 2025, semestre: 1 };
  }
  if (nombre.includes('calculo3') || nombre.includes('cálculo3') || nombre.includes('calculo 3')) {
    return { año: 2025, semestre: 2 };
  }
  if (nombre.includes('calculo1') || nombre.includes('cálculo1') || nombre.includes('calculo 1')) {
    return { año: 2024, semestre: 2 };
  }
  if (nombre.includes('matemática') || nombre.includes('álgebra')) {
    return { año: 2024, semestre: 1 };
  }
  if (nombre.includes('física') || nombre.includes('química')) {
    return { año: 2024, semestre: 2 };
  }
  if (nombre.includes('programación') || nombre.includes('informática')) {
    return { año: 2025, semestre: 1 };
  }

  return { año: 2025, semestre: (index % 2) + 1 };
};

const filtrarHistorial = (historialResponse: any, semestreActual: Semestre) => {
  if (Array.isArray(historialResponse)) {
    return historialResponse.find(
      (h) => Number(h.año) === semestreActual.año && Number(h.semestre) === semestreActual.semestre
    ) || null;
  }

  if (
    historialResponse &&
    typeof historialResponse === 'object' &&
    Number((historialResponse as any).año) === semestreActual.año &&
    Number((historialResponse as any).semestre) === semestreActual.semestre
  ) {
    return historialResponse;
  }

  return null;
};

export const useSemesterPerformanceData = (
  estudiante: Estudiante,
  semestreActual: Semestre
) => {
  const [ramosSemestre, setRamosSemestre] = useState<any[]>([]);
  const [historialSemestre, setHistorialSemestre] = useState<any>(null);
  const [loadingDatos, setLoadingDatos] = useState(false);

  useEffect(() => {
    const cargarDatosSemestre = async () => {
      if (!estudiante.id_estudiante) return;

      setLoadingDatos(true);
      try {
        // 1) Intento filtrado por año/semestre desde el backend
        let ramos = await ramosCursadosService.getByEstudiante(
          estudiante.id_estudiante.toString(),
          semestreActual.año,
          semestreActual.semestre
        );

        // 2) Si no viene nada, obtener todos los ramos del estudiante y filtrar localmente
        if (!ramos || ramos.length === 0) {
          const todos = await ramosCursadosService.getByEstudiante(
            estudiante.id_estudiante.toString()
          );
          ramos = todos || [];
        }

        // 3) Normalizar año/semestre faltantes para que el filtrado funcione
        const ramosNormalizados = (ramos || []).map((ramo: any, index: number) => {
          if (ramo.año && ramo.semestre) return ramo;
          const { año, semestre } = asignarSemestreFallback(ramo.nombre_ramo, index);
          return {
            ...ramo,
            año: ramo.año ?? año,
            semestre: ramo.semestre ?? semestre,
          };
        });

        const ramosFiltrados = (ramosNormalizados || []).filter((ramo) =>
          Number(ramo.año) === semestreActual.año && Number(ramo.semestre) === semestreActual.semestre
        );

        if (ramosFiltrados.length > 0) {
          setRamosSemestre(ramosFiltrados);
        } else if (ramosNormalizados && ramosNormalizados.length > 0) {
          // Si no hay coincidencia exacta, muestra lo que llegó sin perder datos
          setRamosSemestre(ramosNormalizados);
        } else {
          throw new Error('No data from backend, using local fallback');
        }

        try {
          const historialResponse = await historialAcademicoService.getByEstudiante(
            estudiante.id_estudiante.toString()
          );
          setHistorialSemestre(filtrarHistorial(historialResponse, semestreActual));
        } catch (historialError) {
          console.log('No hay historial guardado para este semestre');
          setHistorialSemestre(null);
        }
      } catch (error) {
        console.error('Error cargando datos del semestre:', error);

        const todosLosRamos = estudiante.ramosCursados || [];
        const ramosConSemestre = todosLosRamos.map((ramo: any, index: number) => {
          if (ramo.año && ramo.semestre) {
            return ramo;
          }
          const { año, semestre } = asignarSemestreFallback(ramo.nombre_ramo, index);
          return { ...ramo, año: ramo.año || año, semestre: ramo.semestre || semestre };
        });

        const ramosLocales = ramosConSemestre.filter(
          (r) => r.año === semestreActual.año && r.semestre === semestreActual.semestre
        );
        setRamosSemestre(ramosLocales);
        setHistorialSemestre(null);
      } finally {
        setLoadingDatos(false);
      }
    };

    cargarDatosSemestre();
  }, [estudiante.id_estudiante, estudiante.ramosCursados, semestreActual]);

  return { ramosSemestre, historialSemestre, loadingDatos };
};

export const useSemesterStats = (ramosSemestre: any[], historialSemestre: any) => {
  return useMemo(() => {
    if (historialSemestre) {
      return {
        total:
          (historialSemestre.ramos_aprobados || 0) +
          (historialSemestre.ramos_reprobados || 0) +
          (historialSemestre.ramos_eliminados || 0),
        aprobados: historialSemestre.ramos_aprobados || 0,
        reprobados: historialSemestre.ramos_reprobados || 0,
        eliminados: historialSemestre.ramos_eliminados || 0,
        promedio: historialSemestre.promedio_semestre || null,
      };
    }

    const total = ramosSemestre.length;
    const aprobados = ramosSemestre.filter((r) => r.estado === 'aprobado' || r.estado === 'A').length;
    const reprobados = ramosSemestre.filter((r) => r.estado === 'reprobado' || r.estado === 'R').length;
    const eliminados = ramosSemestre.filter((r) => r.estado === 'eliminado' || r.estado === 'E').length;

    const ramosConNota = ramosSemestre.filter(
      (r) => r.promedio_final && !isNaN(parseFloat(r.promedio_final))
    );
    const promedio =
      ramosConNota.length > 0
        ? ramosConNota.reduce((sum, r) => sum + parseFloat(r.promedio_final), 0) /
          ramosConNota.length
        : null;

    return { total, aprobados, reprobados, eliminados, promedio };
  }, [ramosSemestre, historialSemestre]);
};
