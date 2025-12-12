import React from 'react';
import { LoadingSpinner, ErrorMessage } from '../components/ui';
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
} from '../components/features/student-detail';
import { NuevoSemestreModal } from '../components/features/student-detail/components';

const EstudianteDetail: React.FC = () => {
  // ✅ REFACTORIZADO: Toda la lógica ahora está en hooks personalizados
  const {
    // Datos del estudiante
    loading,
    error,
    estudiante,

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
    nuevoSemestreData,
    setNuevoSemestreData,
    handleCrearNuevoSemestre
  } = useStudentDetail();





  if (loading) {
    return <LoadingSpinner fullScreen message="Cargando datos del estudiante..." />;
  }

  if (error || !estudiante || !estudianteConEdiciones) {
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
          <ProfileSection estudiante={estudianteConEdiciones} />
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
            estudianteId={estudiante.id_estudiante}
          />
        )}
      </div>



      {/* Modal para crear nuevo semestre */}
      <NuevoSemestreModal
        open={mostrarModalNuevoSemestre}
        onClose={() => setMostrarModalNuevoSemestre(false)}
        nuevoSemestreData={nuevoSemestreData}
        setNuevoSemestreData={setNuevoSemestreData as any}
        onCrearSemestre={handleCrearNuevoSemestre}
      />
    </div>
  );
};

export default EstudianteDetail;