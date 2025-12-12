/**
 * Sección de perfil del estudiante
 * Muestra avatar, información básica y resumen académico
 */
import { Box, Paper, Typography, Avatar, Chip } from '@mui/material';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { StatCard } from '../../ui';
import { getEstadoColor } from '../../../utils/estadoColors';
import type { Estudiante } from '../../../types';

interface ProfileSectionProps {
  estudiante: Estudiante;
}

export function ProfileSection({ estudiante }: ProfileSectionProps) {
  const infoFields = [
    { label: 'Nombre Completo', value: estudiante.nombre },
    { label: 'RUT', value: estudiante.rut },
    { label: 'Correo Electrónico', value: estudiante.email },
    { label: 'Teléfono', value: estudiante.telefono },
    { label: 'Universidad', value: estudiante.institucion?.nombre || estudiante.universidad },
    { label: 'Carrera', value: estudiante.institucion?.carrera_especialidad || estudiante.carrera },
    { label: 'Generación', value: estudiante.generacion || estudiante.año_generacion },
    { label: 'Tipo de Estudiante', value: estudiante.tipo_de_estudiante }
  ];

  return (
    <Box>
      {/* Tarjeta de Perfil */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, gap: 4, alignItems: 'start' }}>
          {/* Avatar y Estado */}
          <Box sx={{ textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 180, 
                height: 180, 
                bgcolor: 'grey.300',
                mb: 2,
                mx: 'auto',
                fontSize: '4rem'
              }}
            >
              <AccountCircleIcon sx={{ fontSize: '8rem', color: 'grey.500' }} />
            </Avatar>
            <Chip
              label={estudiante.estado || 'Activo'}
              sx={{
                bgcolor: getEstadoColor(estudiante.estado || 'Activo'),
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                px: 2,
                py: 1
              }}
            />
          </Box>

          {/* Información Principal */}
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Información General
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 3 }}>
              {infoFields.map((field) => (
                <Box key={field.label}>
                  <Typography variant="caption" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ textTransform: field.label === 'Tipo de Estudiante' ? 'capitalize' : 'none' }}>
                    {field.value || 'No especificado'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Resumen Académico */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Resumen Académico
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3, mt: 3 }}>
          <StatCard
            icon="📊"
            label="Promedio General"
            value={estudiante.promedio || 'N/A'}
            accentColor="#2196f3"
          />
          <StatCard
            icon="📚"
            label="Semestre Actual"
            value={estudiante.semestre || 'N/A'}
            accentColor="#4caf50"
          />
          <StatCard
            icon="🎓"
            label="Beca"
            value={estudiante.beca || 'Sin beca'}
            accentColor="#9c27b0"
          />
          <StatCard
            icon="✅"
            label="Estado Académico"
            value={estudiante.status || estudiante.estado || 'N/A'}
            accentColor="#ff9800"
          />
        </Box>
      </Paper>
    </Box>
  );
}
