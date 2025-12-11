import { useState } from 'react';
import { estudianteService, historialAcademicoService } from '../../../services';
import type { Estudiante } from '../../../types';
import { logger } from '../../../config';

interface UseStudentEditingProps {
  id?: string;
  estudiante: Estudiante | null;
  reloadStudentData: () => Promise<void>;
  setInformesGuardados: (fn: (prev: any[]) => any[]) => void;
}

export const useStudentEditing = ({ id, estudiante, reloadStudentData, setInformesGuardados }: UseStudentEditingProps) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [datosEditados, setDatosEditados] = useState<Partial<Estudiante>>({});

  // Handler para capturar cambios en campos editables
  const handleCampoChange = (campo: string, valor: any) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    logger.log(`📝 Campo editado: ${campo} =`, valor);
  };

  // Handler de guardado con datos editados
  const handleGuardar = async () => {
    if (!estudiante || !id) return;

    // Validar que haya cambios
    if (Object.keys(datosEditados).length === 0) {
      alert('⚠️ No hay cambios para guardar');
      setModoEdicion(false);
      return;
    }

    try {
      logger.log('💾 Guardando cambios:', datosEditados);

      // Enviar solo los campos modificados
      await estudianteService.update(id, datosEditados);
      
      logger.log('✅ Cambios guardados exitosamente');
      
      // Recargar datos actualizados
      await reloadStudentData();
      
      // Limpiar estado temporal y salir del modo edición
      setDatosEditados({});
      setModoEdicion(false);
      
      alert('✅ Cambios guardados correctamente');
      
    } catch (err: any) {
      logger.error('❌ Error al guardar cambios:', err);
      
      // Mensaje de error más específico
      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      alert(`❌ Error al guardar cambios:\n\n${errorMsg}`);
    }
  };

  // Manejar activación/cancelación de modo edición
  const handleToggleEdicion = () => {
    if (!modoEdicion) {
      // Activar modo edición → Limpiar cambios previos
      setDatosEditados({});
      logger.log('✏️ Modo edición ACTIVADO');
    } else {
      // Cancelar edición → Limpiar cambios temporales
      setDatosEditados({});
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

  // Crear datos combinados para vista (datos originales + ediciones temporales)
  const getDatosCombinadosParaVista = () => {
    if (!estudiante) return null;
    
    return {
      ...estudiante,
      ...datosEditados
    };
  };

  return {
    modoEdicion,
    datosEditados,
    handleCampoChange,
    handleGuardar,
    handleToggleEdicion,
    handleGenerarInforme,
    getDatosCombinadosParaVista
  };
};