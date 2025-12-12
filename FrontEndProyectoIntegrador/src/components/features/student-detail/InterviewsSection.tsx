/**
 * Sección de entrevistas
 * Lista de entrevistas con botón para agregar nueva
 */
import React from 'react';
import { EntrevistaReportGenerator } from '../../EntrevistaReportGenerator';

interface InterviewsSectionProps {
  onNuevaEntrevista: () => void;
  estudiante?: any;
}

export const InterviewsSection: React.FC<InterviewsSectionProps> = ({ onNuevaEntrevista, estudiante }) => {
  const mockEntrevistas = [
    { 
      id: 1,
      fecha: '2025.05.15', 
      tipo: 'Seguimiento Académico', 
      observaciones: 'Buen desempeño general. Estudiante motivado.',
      tutor: 'María Silva',
      temas_abordados: 'Rendimiento académico, motivación, planificación',
      texto_0: 'El estudiante muestra un compromiso excepcional con sus estudios.',
      texto_1: 'Se trabajó en estrategias de organización del tiempo para el próximo semestre.',
      comentarios_0: 'Mantener el buen desempeño',
      comentarios_1: 'Reforzar técnicas de estudio'
    },
    { 
      id: 2,
      fecha: '2025.03.10', 
      tipo: 'Inicio de Semestre', 
      observaciones: 'Estudiante con expectativas altas para el semestre.',
      tutor: 'Juan Pérez',
      temas_abordados: 'Objetivos del semestre, planificación académica',
      texto_0: 'Reunión de inicio de semestre muy productiva.',
      texto_1: 'Se establecieron metas claras para los próximos meses.',
      comentarios_0: 'Seguimiento mensual recomendado'
    },
    { 
      id: 3,
      fecha: '2024.12.05', 
      tipo: 'Cierre de Semestre', 
      observaciones: 'Excelente rendimiento. Aprobó todos los ramos.',
      tutor: 'Ana Torres',
      temas_abordados: 'Evaluación del semestre, logros obtenidos',
      texto_0: 'Cierre de semestre exitoso con todas las asignaturas aprobadas.',
      comentarios_0: 'Felicitaciones por el esfuerzo'
    },
  ];

  // Generar entrevista consolidada con todos los datos
  const entrevistaConsolidada = {
    id: 'consolidado',
    fecha: new Date(),
    estudiante: estudiante || {
      nombre: 'Estudiante',
      apellido_paterno: '',
      apellido_materno: '',
      rut: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
      direccion: '',
      id: '',
      created_at: new Date(),
      updated_at: new Date()
    },
    tutor: 'Reporte Consolidado',
    temas_abordados: `Resumen de ${mockEntrevistas.length} entrevistas realizadas`,
    observaciones: `Este documento contiene el historial completo de entrevistas del estudiante.`,
    ...mockEntrevistas.reduce((acc, ent, idx) => {
      acc[`texto_${idx}`] = `[${ent.fecha}] ${ent.tipo}: ${ent.observaciones}`;
      acc[`comentarios_${idx}`] = `Tutor: ${ent.tutor} - ${ent.temas_abordados}`;
      return acc;
    }, {} as any),
    created_at: new Date(),
    updated_at: new Date()
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Entrevistas</h2>
        <div className="flex gap-3">
          <EntrevistaReportGenerator entrevista={entrevistaConsolidada} />
          <button 
            onClick={onNuevaEntrevista}
            className="px-5 py-2.5 bg-[var(--color-turquoise)] text-white rounded-lg hover:bg-[var(--color-turquoise-light)] transition-colors text-sm font-medium"
          >
            ➕ Nueva Entrevista
          </button>
        </div>
      </div>

      <Stack spacing={2}>
        {mockEntrevistas.map((entrevista) => (
          <Paper 
            key={entrevista.id}
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {entrevista.tipo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {entrevista.fecha}
                </Typography>
              </Box>
              <Chip 
                label="Completada" 
                color="primary" 
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                Observaciones:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {entrevista.observaciones}
              </Typography>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                startIcon={<VisibilityIcon />}
                variant="outlined"
                size="small"
                onClick={() => handleEditarEntrevista(entrevista.id)}
              >
                Ver Detalle
              </Button>
              <Button 
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleEditarEntrevista(entrevista.id)}
              >
                Editar
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>

      {mockEntrevistas.length === 0 && (
        <Paper elevation={2} sx={{ p: 8, borderRadius: 2, textAlign: 'center' }}>
          <ArticleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            No hay entrevistas registradas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Comienza agregando la primera entrevista del estudiante.
          </Typography>
          <Button 
            startIcon={<AddIcon />}
            onClick={() => setMostrarModalNuevaEntrevista(true)}
            variant="contained"
            size="large"
          >
            Agregar Primera Entrevista
          </Button>
        </Paper>
      )}

      {/* Modal para crear nueva entrevista */}
      <NuevaEntrevistaModal
        open={mostrarModalNuevaEntrevista}
        onClose={() => setMostrarModalNuevaEntrevista(false)}
        estudianteId={estudianteId}
      />
    </Box>
  );
}
