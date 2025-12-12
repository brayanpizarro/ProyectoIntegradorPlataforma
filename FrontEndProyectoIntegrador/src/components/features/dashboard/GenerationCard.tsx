/**
 * Tarjeta individual de generación
 * Muestra año, cantidad de estudiantes y estado
 */
import React from 'react';
import { Card, CardContent, Box, Typography, Chip, Button } from '@mui/material';
import { School as SchoolIcon, Add as AddIcon } from '@mui/icons-material';

interface GenerationCardProps {
  año: number;
  estudiantes: number;
  activos: number;
  estado: 'activa' | 'finalizada';
  onClick: () => void;
  onAddEstudiante?: (año: number) => void;
}

export function GenerationCard({
  año,
  estudiantes,
  activos,
  estado,
  onClick,
  onAddEstudiante,
}: GenerationCardProps) {
  const handleAddEstudiante = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEstudiante?.(año);
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid',
        borderColor: 'grey.200',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header con icono y estado */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, color: '#4db6ac' }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Generación {año}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Año {año}
              </Typography>
            </Box>
          </Box>

          {/* Indicador de estado */}
          <Chip
            label={estado === 'activa' ? '🟢 Activa' : '🟡 Finalizada'}
            size="small"
            sx={{
              backgroundColor: estado === 'activa' ? 'rgba(77, 182, 172, 0.2)' : 'rgba(255, 152, 0, 0.2)',
              color: estado === 'activa' ? '#4db6ac' : '#ff9800',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          />
        </Box>

        {/* Estadísticas */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              {estudiantes}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Estudiantes
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="#4db6ac">
              {activos}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Activos
            </Typography>
          </Box>
        </Box>

        {/* Botón para agregar estudiante */}
        {onAddEstudiante && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEstudiante}
            sx={{
              mt: 2,
              backgroundColor: '#4db6ac',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(77, 182, 172, 0.9)'
              }
            }}
          >
            Agregar Estudiante
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
