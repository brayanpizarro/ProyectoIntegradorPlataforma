/**
 * Sección de entrevistas
 * Lista de entrevistas con botón para agregar nueva
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Chip, Stack } from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Edit as EditIcon, Article as ArticleIcon } from '@mui/icons-material';
import { NuevaEntrevistaModal } from './components';

interface InterviewsSectionProps {
  estudianteId: string | number;
}

export function InterviewsSection({ estudianteId }: InterviewsSectionProps) {
  const navigate = useNavigate();
  const [mostrarModalNuevaEntrevista, setMostrarModalNuevaEntrevista] = useState(false);
  
  const mockEntrevistas = [
    { id: '1', fecha: '2025.05.15', tipo: 'Seguimiento Académico', observaciones: 'Buen desempeño general. Estudiante motivado.' },
    { id: '2', fecha: '2025.03.10', tipo: 'Inicio de Semestre', observaciones: 'Estudiante con expectativas altas para el semestre.' },
    { id: '3', fecha: '2024.12.05', tipo: 'Cierre de Semestre', observaciones: 'Excelente rendimiento. Aprobó todos los ramos.' },
  ];

  const handleEditarEntrevista = (entrevistaId: string) => {
    // Navegar al workspace de entrevistas con el ID del estudiante y la entrevista
    navigate(`/entrevista/${estudianteId}?entrevistaId=${entrevistaId}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Entrevistas
        </Typography>
        <Button 
          startIcon={<AddIcon />}
          onClick={() => setMostrarModalNuevaEntrevista(true)}
          variant="contained"
          color="primary"
          size="large"
        >
          Nueva Entrevista
        </Button>
      </Box>

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
