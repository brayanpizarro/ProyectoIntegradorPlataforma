/**
 * Sección de entrevistas
 * Lista de entrevistas con botón para agregar nueva
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Chip, Stack, CircularProgress } from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Edit as EditIcon, Article as ArticleIcon } from '@mui/icons-material';
import { NuevaEntrevistaModal } from './components';
import { EntrevistaReportGenerator } from '../../EntrevistaReportGenerator';
import { entrevistaService } from '../../../services';
import type { Entrevista } from '../../../types';

interface InterviewsSectionProps {
  estudianteId: string | number;
  estudiante?: any;
}

export function InterviewsSection({ estudianteId, estudiante }: InterviewsSectionProps) {
  const navigate = useNavigate();
  const [mostrarModalNuevaEntrevista, setMostrarModalNuevaEntrevista] = useState(false);
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar entrevistas del backend
  useEffect(() => {
    const loadEntrevistas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await entrevistaService.getByEstudiante(estudianteId.toString());
        setEntrevistas(data);
      } catch (err) {
        console.error('Error al cargar entrevistas:', err);
        setError('Error al cargar las entrevistas');
        setEntrevistas([]);
      } finally {
        setLoading(false);
      }
    };

    if (estudianteId) {
      loadEntrevistas();
    }
  }, [estudianteId]);

  const handleEditarEntrevista = (entrevista: Entrevista) => {
    if (!entrevista.id) {
      console.error('ID de entrevista inválido');
      return;
    }
    navigate(`/entrevista/${entrevista.id}`);
  };

  // Generar entrevista consolidada con datos reales
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
    temas_abordados: `Resumen de ${entrevistas.length} entrevistas realizadas`,
    observaciones: `Este documento contiene el historial completo de entrevistas del estudiante.`,
    // Incluir todas las etiquetas de todas las entrevistas
    etiquetas: entrevistas.flatMap((ent) => Array.isArray(ent.etiquetas) ? ent.etiquetas : []),
    ...entrevistas.reduce((acc, ent, idx) => {
      const fecha = new Date(ent.fecha).toLocaleDateString('es-CL');
      acc[`texto_${idx}`] = `[${fecha}] ${ent.tipo_entrevista || 'Entrevista'}: ${ent.observaciones}`;
      acc[`comentarios_${idx}`] = `Tutor: ${ent.nombre_Tutor} - ${ent.temas_abordados?.join(', ') || 'N/A'}`;
      return acc;
    }, {} as any),
    created_at: new Date(),
    updated_at: new Date()
  };

  // Mostrar loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={() => window.location.reload()} variant="outlined">
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Entrevistas
        </Typography>
        <Stack direction="row" spacing={2}>
          {entrevistas.length > 0 && (
            <EntrevistaReportGenerator entrevista={entrevistaConsolidada} />
          )}
          <Button 
            startIcon={<AddIcon />}
            onClick={() => setMostrarModalNuevaEntrevista(true)}
            variant="contained"
            color="primary"
            size="large"
          >
            Nueva Entrevista
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {entrevistas.map((entrevista) => (
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
                  {entrevista.tipo_entrevista || 'Entrevista'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {new Date(entrevista.fecha).toLocaleDateString('es-CL')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tutor: {entrevista.nombre_Tutor}
                </Typography>
              </Box>
              <Chip 
                label={entrevista.estado || 'Completada'} 
                color={entrevista.estado === 'completada' ? 'success' : 'primary'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                Observaciones:
              </Typography>
              <Typography variant="body2" color="text.primary">
                {entrevista.observaciones || 'Sin observaciones'}
              </Typography>
            </Box>

            {entrevista.temas_abordados && entrevista.temas_abordados.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary" gutterBottom>
                  Temas:
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {entrevista.temas_abordados.join(', ')}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                startIcon={<VisibilityIcon />}
                variant="outlined"
                size="small"
                onClick={() => handleEditarEntrevista(entrevista)}
              >
                Ver Detalle
              </Button>
              <Button 
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleEditarEntrevista(entrevista)}
              >
                Editar
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>

      {entrevistas.length === 0 && (
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
