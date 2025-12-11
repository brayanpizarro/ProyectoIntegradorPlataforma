import React from 'react';
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
  useStudentDetail
} from '../components/StudentDetail';

const EstudianteDetail: React.FC = () => {
  // ✅ REFACTORIZADO: Toda la lógica ahora está en hooks personalizados
  const {
    // Datos del estudiante
    loading,
    error,
    estudiante,
    informesGuardados,
    
    // Permisos y navegación
    canEdit,
    canViewInterviews,
    seccionActiva,
    handleSeccionChange,
    
    // Edición
    modoEdicion,
    handleCampoChange,
    handleGuardar,
    handleToggleEdicion,
    handleGenerarInforme,
    estudianteConEdiciones,
    
    // Semestres
    mostrarModalNuevoSemestre,
    setMostrarModalNuevoSemestre,
    semestreSeleccionado,
    mostrarModalDetalleSemestre,
    setMostrarModalDetalleSemestre,
    editandoSemestre,
    datosEditadosSemestre,
    setDatosEditadosSemestre,
    nuevoSemestreData,
    setNuevoSemestreData,
    handleCrearNuevoSemestre,
    handleVerDetalleSemestre,
    handleEditarSemestre,
    handleCancelarEdicionSemestre,
    
    // Entrevistas
    mostrarModalNuevaEntrevista,
    setMostrarModalNuevaEntrevista,
    
    // Handlers adicionales de semestres
    handleSeleccionarSemestre,
    handleGuardarSemestre,
    handleAgregarComentario,
    handleEliminarComentario
  } = useStudentDetail();





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
        canEdit={canEdit}
      />

      {/* Navegación por tabs */}
      <TabNavigation
        seccionActiva={seccionActiva}
        onSeccionChange={handleSeccionChange}
        canViewInterviews={canViewInterviews}
      />

      {/* Contenido principal */}
      <div className="p-8 max-w-[1400px] mx-auto">
        {/* Perfil General */}
        {seccionActiva === 'perfil' && (
          <ProfileSection 
            estudiante={estudianteConEdiciones}
            modoEdicion={modoEdicion && canEdit}
            onCampoChange={handleCampoChange} 
          />
        )}

        {/* ✅ Datos Personales - Con callback para cambios */}
        {seccionActiva === 'personal' && (
          <PersonalDataSection 
            estudiante={estudianteConEdiciones}
            modoEdicion={modoEdicion && canEdit} 
            onCampoChange={handleCampoChange}
          />
        )}

        {/* Información Familiar */}
        {seccionActiva === 'familiar' && (
          <FamilyInfoSection 
            estudiante={estudiante} 
            modoEdicion={modoEdicion && canEdit} 
          />
        )}

        {/* Informe Académico */}
        {seccionActiva === 'informe' && (
          <AcademicReportSection 
            estudiante={estudianteConEdiciones}
            modoEdicion={modoEdicion && canEdit} 
          />
        )}

        {/* Desempeño por Semestre */}
        {seccionActiva === 'desempeno' && (
          <SemesterPerformanceSection 
            estudiante={estudiante} 
            modoEdicion={modoEdicion && canEdit} 
          />
        )}

        {/* Avance Curricular */}
        {seccionActiva === 'avance' && (
          <AvanceCurricularSection estudiante={estudianteConEdiciones} />
        )}

        {/* Entrevistas - Solo para administradores */}
        {seccionActiva === 'entrevistas' && canViewInterviews && (
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

              <div className="grid grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ramos Eliminados
                  </label>
                  <input
                    type="number"
                    value={nuevoSemestreData.ramos_eliminados}
                    onChange={(e) => setNuevoSemestreData(prev => ({
                      ...prev,
                      ramos_eliminados: parseInt(e.target.value) || 0
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