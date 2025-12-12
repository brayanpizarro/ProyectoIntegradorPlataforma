/**
 * Header del detalle de estudiante
 * Muestra nombre, estado, botones de edición y volver
 */
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip, Paper } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { getEstadoColor } from '../../../utils/estadoColors';

interface StudentHeaderProps {
  nombres: string;
  estado: string;
  modoEdicion: boolean;
  onToggleEdicion: () => void;
  onGuardar?: () => void;
  onGenerarInforme?: () => void;
  canEdit?: boolean;
}

export function StudentHeader({
  nombres,
  estado,
  modoEdicion,
  onToggleEdicion,
  onGuardar,
  onGenerarInforme,
  canEdit = true,
}: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <Paper 
      elevation={1}
      sx={{ 
        px: 4, 
        py: 2, 
        borderBottom: 2, 
        borderColor: 'grey.200'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: 'grey.600',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'grey.700'
              }
            }}
          >
            Volver
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              {nombres}
            </Typography>
            <Chip
              label={estado}
              sx={{
                bgcolor: getEstadoColor(estado),
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {canEdit && (
            <>
              <Button 
                variant="contained"
                startIcon={modoEdicion ? <VisibilityIcon /> : <EditIcon />}
                onClick={onToggleEdicion}
                sx={{
                  bgcolor: '#4db6ac',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#80cbc4'
                  }
                }}
              >
                {modoEdicion ? 'Modo Vista' : 'Modo Edición'}
              </Button>
              {modoEdicion && (
                <Button 
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={onGuardar}
                  sx={{
                    bgcolor: '#4db6ac',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#80cbc4'
                    }
                  }}
                >
                  Guardar
                </Button>
              )}
            </>
          )}
          <Button 
            variant="contained"
            startIcon={<DescriptionIcon />}
            onClick={onGenerarInforme}
            sx={{
              bgcolor: 'warning.main',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'warning.dark'
              }
            }}
          >
            Generar Informe
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
