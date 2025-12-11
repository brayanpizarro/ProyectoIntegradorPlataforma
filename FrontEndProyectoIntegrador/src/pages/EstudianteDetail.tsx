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
  const [mostrarModalNuevoSemestre, setMostrarModalNuevoSemestre] = useState(false);
  
  const [informesGuardados, setInformesGuardados] = useState<any[]>([]);

  // ✅ NUEVO: Estado para almacenar cambios temporales
  const [datosEditados, setDatosEditados] = useState<Partial<Estudiante>>({});

  // Estado para nuevo semestre
  const [nuevoSemestreData, setNuevoSemestreData] = useState({
    año: new Date().getFullYear(),
    semestre: new Date().getMonth() < 6 ? 1 : 2,
    nivel_educativo: '',
    ramos_aprobados: 0,
    ramos_reprobados: 0,
    promedio_semestre: 0
  });

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

  const handleCrearNuevoSemestre = async () => {
    if (!id || !estudiante) return;

    try {
      const historialData = {
        id_estudiante: id,
        año: nuevoSemestreData.año,
        semestre: nuevoSemestreData.semestre,
        nivel_educativo: nuevoSemestreData.nivel_educativo || estudiante.institucion?.nivel_educativo || 'Superior',
        ramos_aprobados: nuevoSemestreData.ramos_aprobados,
        ramos_reprobados: nuevoSemestreData.ramos_reprobados,
        promedio_semestre: nuevoSemestreData.promedio_semestre,
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
      
      // Resetear formulario y cerrar modal
      setNuevoSemestreData({
        año: new Date().getFullYear(),
        semestre: new Date().getMonth() < 6 ? 1 : 2,
        nivel_educativo: '',
        ramos_aprobados: 0,
        ramos_reprobados: 0,
        promedio_semestre: 0
      });
      setMostrarModalNuevoSemestre(false);
      
      logger.log('✅ Nuevo semestre creado:', nuevoInforme);
      alert(`✅ Semestre creado exitosamente\nAño: ${historialData.año} | Semestre: ${historialData.semestre}`);
    } catch (err: any) {
      logger.error('❌ Error al crear semestre:', err);
      alert(`❌ Error al crear semestre: ${err.message}`);
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
        nombres={estudianteConEdiciones.nombre || ''}
        estado={estudianteConEdiciones.status || 'activo'}
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
              <div className="flex gap-2">
                <button 
                  onClick={() => setMostrarModalNuevoSemestre(true)}
                  className="px-4 py-2 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors font-medium"
                >
                  ➕ Nuevo Semestre
                </button>
                <button 
                  onClick={() => setMostrarModalSemestresAnteriores(false)}
                  className="p-2 bg-gray-100 border-none rounded-md cursor-pointer text-xl text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
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

      {/* Modal para crear nuevo semestre */}
      {mostrarModalNuevoSemestre && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-8">
          <div className="bg-white rounded-xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="m-0 text-2xl font-bold text-gray-800">
                ➕ Crear Nuevo Semestre
              </h3>
              <button 
                onClick={() => setMostrarModalNuevoSemestre(false)}
                className="p-2 bg-gray-100 border-none rounded-md cursor-pointer text-xl text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Año *
                  </label>
                  <input
                    type="number"
                    value={nuevoSemestreData.año}
                    onChange={(e) => setNuevoSemestreData(prev => ({
                      ...prev,
                      año: parseInt(e.target.value) || new Date().getFullYear()
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Semestre *
                  </label>
                  <select
                    value={nuevoSemestreData.semestre}
                    onChange={(e) => setNuevoSemestreData(prev => ({
                      ...prev,
                      semestre: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Primer Semestre</option>
                    <option value={2}>Segundo Semestre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nivel Educativo
                </label>
                <input
                  type="text"
                  value={nuevoSemestreData.nivel_educativo}
                  onChange={(e) => setNuevoSemestreData(prev => ({
                    ...prev,
                    nivel_educativo: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Superior, Media, Técnico"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ramos Aprobados
                  </label>
                  <input
                    type="number"
                    value={nuevoSemestreData.ramos_aprobados}
                    onChange={(e) => setNuevoSemestreData(prev => ({
                      ...prev,
                      ramos_aprobados: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ramos Reprobados
                  </label>
                  <input
                    type="number"
                    value={nuevoSemestreData.ramos_reprobados}
                    onChange={(e) => setNuevoSemestreData(prev => ({
                      ...prev,
                      ramos_reprobados: parseInt(e.target.value) || 0
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Promedio del Semestre
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={nuevoSemestreData.promedio_semestre}
                  onChange={(e) => setNuevoSemestreData(prev => ({
                    ...prev,
                    promedio_semestre: parseFloat(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1.0"
                  max="7.0"
                  placeholder="Ej: 5.5"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModalNuevoSemestre(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 border-none rounded-md cursor-pointer hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrearNuevoSemestre}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-blue-700 transition-colors font-medium"
                >
                  Crear Semestre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudianteDetail;