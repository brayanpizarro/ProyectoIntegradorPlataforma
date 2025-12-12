import { useState, useEffect } from 'react';
import { historialAcademicoService } from '../../../../services';
import type { Estudiante } from '../../../../types';
import { logger } from '../../../../config';
import { useAutosave } from './useAutosave';
import { useEstudianteEditing } from './useEstudianteEditing';
import { useFamiliaEditing } from './useFamiliaEditing';
import { useAcademicEditing } from './useAcademicEditing';

interface UseStudentEditingProps {
  id?: string;
  estudiante: Estudiante | null;
  reloadStudentData: () => Promise<void>;
  setInformesGuardados: (fn: (prev: any[]) => any[]) => void;
}

export const useStudentEditing = ({ id, estudiante, reloadStudentData, setInformesGuardados }: UseStudentEditingProps) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isGuardando, setIsGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string>('');
  const [mensajeError, setMensajeError] = useState<string>('');

  const estudianteEditing = useEstudianteEditing({ estudiante, id });
  const familiaEditing = useFamiliaEditing({ estudiante });
  const academicEditing = useAcademicEditing({ estudiante });

  // Combinar todos los datos editados para autosave
  const todosLosDatosEditados = {
    ...estudianteEditing.datosEditados,
    familia: familiaEditing.datosFamiliaEditados,
    informacionAcademica: academicEditing.datosAcademicosEditados
  };

  // Autosave combinado
  const { recoverAutosave, clearAutosave } = useAutosave({
    id,
    data: todosLosDatosEditados,
    prefix: 'student_edit_',
    interval: 30000
  });

  // Verificar si hay cambios pendientes en cualquier dominio
  const hayCambiosPendientes =
    estudianteEditing.hayCambios ||
    familiaEditing.hayCambios ||
    academicEditing.hayCambios;


  useEffect(() => {
    if (!id || !estudiante) return;

    const savedData = recoverAutosave();
    if (savedData) {
      // Restaurar datos en los hooks especializados si es necesario
      // Por ahora solo logueamos que se recuperaron
      logger.log('📦 Datos de autosave disponibles');
    }
  }, [id, estudiante, recoverAutosave]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hayCambiosPendientes) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requiere esto
        return ''; // Otros navegadores
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hayCambiosPendientes]);

  // ============================================
  // HANDLERS - Delegan a los hooks especializados
  // ============================================

  // Handler para cambios en campos del estudiante
  const handleCampoChange = (campo: string, valor: any) => {

    const camposEstudiante = [
      'nombre', 'rut', 'telefono', 'email', 'genero', 'direccion',
      'fecha_de_nacimiento', 'tipo_de_estudiante', 'status', 'generacion',
      'numero_carrera', 'observaciones', 'status_detalle',
      'semestres_suspendidos', 'semestres_total_carrera'
    ];

    const camposAcademicos = [
      'año_ingreso_beca', 'colegio', 'especialidad_colegio',
      'comuna_colegio', 'via_acceso', 'beneficios',
      'promedio_1', 'promedio_2', 'promedio_3', 'promedio_4',
      'puntajes_paes'
    ];

    if (camposEstudiante.includes(campo)) {
      estudianteEditing.handleCampoChange(campo, valor);
    } else if (camposAcademicos.includes(campo)) {
      academicEditing.handleCampoChange(campo, valor);
    }
  };

  const handleFamiliaChange = (campo: string, valor: any) => {
    familiaEditing.handleFamiliaChange(campo, valor);
  };

  const handleGuardar = async () => {
    if (!estudiante || !id) return;

    if (!hayCambiosPendientes) {
      setMensajeError('No hay cambios para guardar');
      setModoEdicion(false);
      return;
    }

    setIsGuardando(true);
    setMensajeError('');
    setMensajeExito('');

    try {
      logger.log('💾 Guardando cambios en todos los dominios...');

      // Guardar en paralelo todos los dominios que tienen cambios
      const promesas: Promise<void>[] = [];

      if (estudianteEditing.hayCambios) {
        promesas.push(estudianteEditing.guardarCambios());
      }

      if (familiaEditing.hayCambios) {
        promesas.push(familiaEditing.guardarCambios());
      }

      if (academicEditing.hayCambios) {
        promesas.push(academicEditing.guardarCambios());
      }

      // Ejecutar todos los guardados en paralelo
      await Promise.all(promesas);

      logger.log('✅ Cambios guardados exitosamente en todos los dominios');

      await reloadStudentData();

      estudianteEditing.limpiarCambios();
      familiaEditing.limpiarCambios();
      academicEditing.limpiarCambios();

      setModoEdicion(false);

      clearAutosave();

      setMensajeExito('Cambios guardados correctamente');

    } catch (err: any) {
      logger.error('❌ Error al guardar cambios:', err);

      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      setMensajeError(`Error al guardar cambios: ${errorMsg}`);
    } finally {
      setIsGuardando(false);
    }
  };

  const handleToggleEdicion = () => {
    if (!modoEdicion) {
      logger.log('✏️ Modo edición ACTIVADO');
    } else {
      // Cancelar edición → Limpiar cambios temporales de todos los dominios
      estudianteEditing.limpiarCambios();
      familiaEditing.limpiarCambios();
      academicEditing.limpiarCambios();
      logger.log('❌ Modo edición CANCELADO (cambios descartados)');
    }
    setModoEdicion(!modoEdicion);
  };

  // Generar informe académico
  const handleGenerarInforme = async () => {
    if (!id || !estudiante) return;

    try {
      const añoActual = new Date().getFullYear();
      const semestreActual = new Date().getMonth() < 6 ? 1 : 2;

      const historialData = {
        id_estudiante: id,
        año: añoActual,
        semestre: semestreActual,
        nivel_educativo: estudiante.institucion?.nivel_educativo || 'Superior',
        ramos_aprobados: 0,
        ramos_reprobados: 0,
        promedio_semestre: 0,
        trayectoria_academica: [],
      };

      const response = await historialAcademicoService.create(historialData);

      const nuevoInforme = {
        ...(response || {}),
        fechaFormateada: new Date().toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };

      setInformesGuardados(prev => [...prev, nuevoInforme]);

      logger.log('✅ Informe generado:', nuevoInforme);
      alert(`✅ Informe generado\nAño: ${añoActual} | Semestre: ${semestreActual}`);
    } catch (err: any) {
      logger.error('❌ Error al generar informe:', err);
      alert(`❌ Error al generar informe: ${err.message}`);
    }
  };

  // ============================================
  // DATOS COMBINADOS - Originales + Ediciones
  // ============================================
  const getDatosCombinadosParaVista = () => {
    if (!estudiante) return null;

    // Combinar datos de todos los dominios
    const estudianteCombinado = estudianteEditing.getDatosCombinados();
    const familiaCombinada = familiaEditing.getDatosCombinados();
    const academicoCombinado = academicEditing.getDatosCombinados();

    return {
      ...estudianteCombinado,
      familia: familiaCombinada || estudiante.familia,
      informacionAcademica: academicoCombinado || estudiante.informacionAcademica
    };
  };

  return {
    modoEdicion,
    datosEditados: todosLosDatosEditados, // Para compatibilidad
    hayCambiosPendientes,
    isGuardando,
    mensajeExito,
    mensajeError,

    handleCampoChange,
    handleFamiliaChange,
    handleGuardar,
    handleToggleEdicion,
    handleGenerarInforme,
    getDatosCombinadosParaVista,

    setMensajeExito,
    setMensajeError
  };
};