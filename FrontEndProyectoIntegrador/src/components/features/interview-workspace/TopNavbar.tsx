import { AppBar, Toolbar, Button, Breadcrumbs, Typography, Avatar, Chip, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import type { Estudiante } from '../../../types';

interface TopNavbarProps {
  estudiante: Estudiante;
  onNavigateBack: () => void;
}

export function TopNavbar({ estudiante, onNavigateBack }: TopNavbarProps) {
  // ✅ DATOS: Obtener información con compatibilidad híbrida
  const nombreCompleto = estudiante.nombre || 
    `${estudiante.nombres || ''} ${estudiante.apellidos || ''}`.trim();
  const carrera = estudiante.carrera || estudiante.institucion?.carrera_especialidad || 'Sin especificar';
  const universidad = estudiante.universidad || 
    estudiante.institucion?.nombre_institucion || 
    'Sin especificar';

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary', height: 64 }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
        {/* ✅ LADO IZQUIERDO: Logo y navegación */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onNavigateBack}
            variant="outlined"
            size="small"
            sx={{ color: 'text.secondary', borderColor: 'grey.300' }}
          >
            Volver
          </Button>
          
          <Breadcrumbs separator="›" sx={{ color: 'text.secondary' }}>
            <Typography variant="body2">Entrevistas</Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {nombreCompleto}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* ✅ CENTRO: Información del estudiante */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 40, height: 40 }}>
            <AccountCircleIcon />
          </Avatar>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" fontWeight={600}>
              {nombreCompleto}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {carrera} • {universidad}
            </Typography>
          </Box>
        </Box>

        {/* ✅ LADO DERECHO: Usuario actual y botón terminar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              if (window.confirm('¿Deseas terminar y guardar esta entrevista?')) {
                onNavigateBack();
              }
            }}
            variant="contained"
            color="primary"
            size="medium"
            sx={{ fontWeight: 600 }}
          >
            Terminar Entrevista
          </Button>

          <Chip
            label="🟢 Activa"
            size="small"
            sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 600 }}
          />
          
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            A
          </Avatar>
          
          <Box>
            <Typography variant="body2" fontWeight={600}>Admin</Typography>
            <Typography variant="caption" color="text.secondary">Entrevistador</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}