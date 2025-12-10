import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService, estudianteService, historialAcademicoService } from '../services';
import type { Estudiante } from '../types';
import { logger } from '../config';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import { 
  StudentHeader, 
  TabNavigation, 
  ProfileSection,
  PersonalDataSection,
  FamilyInfoSection,
  AcademicReportSection,
  SemesterPerformanceSection,
  InterviewsSection,
  AvanceCurricularSection,
  type SeccionActiva 
} from '../components/StudentDetail';

const EstudianteDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('perfil');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarModalNuevaEntrevista, setMostrarModalNuevaEntrevista] = useState(false);
  const [mostrarModalSemestresAnteriores, setMostrarModalSemestresAnteriores] = useState(false);
  
  const [informesGuardados, setInformesGuardados] = useState<any[]>([]);

  // ✅ NUEVO: Estado para almacenar cambios temporales
  const [datosEditados, setDatosEditados] = useState<Partial<Estudiante>>({});

  // Verificar autenticación y cargar estudiante
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    const fetchEstudiante = async () => {
      if (!id) {
        setError('ID de estudiante no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        logger.log('🔍 Cargando estudiante:', id);
        
        const data = await estudianteService.getById(id);
        setEstudiante(data);
        
        logger.log('✅ Estudiante cargado:', data.nombre);
      } catch (err: any) {
        logger.error('❌ Error al cargar estudiante:', err);
        setError(err.message || 'Error al cargar el estudiante');
        setEstudiante(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstudiante();
  }, [navigate, id]);

  useEffect(() => {
    if (!id) return;

    const cargarHistorialAcademico = async () => {
      try {
        const historiales = await historialAcademicoService.getByEstudiante(id);
        setInformesGuardados(Array.isArray(historiales) ? historiales : []);
        logger.log('📂 Historial académico cargado:', Array.isArray(historiales) ? historiales.length : 0, 'registros');
      } catch (err) {
        logger.error('❌ Error al cargar historial académico:', err);
      }
    };

    cargarHistorialAcademico();
  }, [id]);

  // ✅ NUEVO: Handler para capturar cambios en campos editables
  const handleCampoChange = (campo: string, valor: any) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    logger.log(`📝 Campo editado: ${campo} =`, valor);
  };

  // ✅ ACTUALIZADO: Handler de guardado con datos editados
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
      const dataActualizada = await estudianteService.getById(id);
      setEstudiante(dataActualizada);
      
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

  // ✅ ACTUALIZADO: Manejar activación/cancelación de modo edición
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
  // RENDERIZADO
  // ============================================

  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando datos del estudiante..." />;
  }

  if (error || !estudiante) {
    return (
      <ErrorMessage 
        fullScreen 
        title="Error al cargar estudiante"
        message={error || 'No se pudo cargar la información del estudiante'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ✅ Combinar datos originales con ediciones temporales
  const estudianteConEdiciones = {
    ...estudiante,
    ...datosEditados
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header del estudiante */}
      <StudentHeader
<<<<<<< Updated upstream
        nombres={estudianteConEdiciones.nombre || ''}
        apellidos={estudianteConEdiciones.apellidos || ''}
        estado={estudianteConEdiciones.status || 'activo'}
=======
        nombres={estudiante.nombre || ''}
        estado={estudiante.status || 'activo'}
>>>>>>> Stashed changes
        modoEdicion={modoEdicion}
        onToggleEdicion={handleToggleEdicion}
        onGuardar={handleGuardar}
        onGenerarInforme={handleGenerarInforme}
      />

      {/* Navegación por tabs */}
      <TabNavigation
        seccionActiva={seccionActiva}
        onSeccionChange={setSeccionActiva}
      />

      {/* Contenido principal */}
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Perfil General */}
        {seccionActiva === 'perfil' && (
          <ProfileSection estudiante={estudianteConEdiciones} />
        )}

        {/* ✅ Datos Personales - Con callback para cambios */}
        {seccionActiva === 'personal' && (
          <PersonalDataSection 
            estudiante={estudianteConEdiciones}
            modoEdicion={modoEdicion} 
            onCampoChange={handleCampoChange}
          />
        )}

        {/* Información Familiar */}
        {seccionActiva === 'familiar' && (
          <FamilyInfoSection 
            estudiante={estudiante} 
            modoEdicion={modoEdicion} 
          />
        )}

        {/* Informe Académico */}
        {seccionActiva === 'informe' && (
          <div>
            {informesGuardados.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setMostrarModalSemestresAnteriores(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  📋 Ver Semestres Anteriores ({informesGuardados.length})
                </button>
              </div>
            )}
            <AcademicReportSection 
              estudiante={estudianteConEdiciones}
              modoEdicion={modoEdicion} 
            />
          </div>
        )}

        {/* Desempeño por Semestre */}
        {seccionActiva === 'desempeno' && (
          <div>
            {informesGuardados.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setMostrarModalSemestresAnteriores(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  📋 Ver Semestres Anteriores ({informesGuardados.length})
                </button>
              </div>
            )}
            <SemesterPerformanceSection 
              estudiante={estudiante} 
              modoEdicion={modoEdicion} 
            />
          </div>
        )}

        {/* Avance Curricular */}
        {seccionActiva === 'avance' && (
          <AvanceCurricularSection estudiante={estudianteConEdiciones} />
        )}

        {/* Entrevistas */}
        {seccionActiva === 'entrevistas' && (
          <InterviewsSection 
            onNuevaEntrevista={() => setMostrarModalNuevaEntrevista(true)} 
          />
        )}
      </div>

      {/* MODALES (sin cambios) */}
      {mostrarModalNuevaEntrevista && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-8 max-w-[500px] w-[90%] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="m-0 text-2xl font-bold text-gray-800">
                📝 Nueva Entrevista
              </h3>
              <button 
                onClick={() => setMostrarModalNuevaEntrevista(false)}
                className="p-2 bg-gray-100 border-none rounded-md cursor-pointer text-xl text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Funcionalidad en desarrollo. Próximamente podrás crear y gestionar entrevistas.
            </p>

            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setMostrarModalNuevaEntrevista(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalSemestresAnteriores && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-8">
          <div className="bg-white rounded-xl p-8 max-w-[900px] w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="m-0 text-2xl font-bold text-gray-800">
                📚 Semestres Guardados
              </h3>
              <button 
                onClick={() => setMostrarModalSemestresAnteriores(false)}
                className="p-2 bg-gray-100 border-none rounded-md cursor-pointer text-xl text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Snapshots de semestres anteriores. Selecciona uno para ver su información.
            </p>

            <div className="flex flex-col gap-4">
              {informesGuardados.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">📭 No hay semestres guardados</p>
                  <p className="text-sm mt-2">
                    Genera un nuevo informe para crear un snapshot del semestre actual.
                  </p>
                </div>
              ) : (
                informesGuardados.map((historial, index) => (
                  <div 
                    key={historial.id_historial_academico || index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                          Semestre {historial.semestre} - {historial.año}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Nivel:</strong> {historial.nivel_educativo || 'No especificado'}
                          </p>
                          <p>
                            <strong>Ramos aprobados:</strong> {historial.ramos_aprobados || 0}
                          </p>
                          <p>
                            <strong>Ramos reprobados:</strong> {historial.ramos_reprobados || 0}
                          </p>
                          <p>
                            <strong>Promedio:</strong> {historial.promedio_semestre || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{historial.fechaFormateada || 'Fecha no disponible'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="m-0 text-sm text-gray-700">
                💡 <strong>Nota:</strong> Los semestres guardados son snapshots de solo lectura. 
                No se pueden editar una vez generados.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteDetail;