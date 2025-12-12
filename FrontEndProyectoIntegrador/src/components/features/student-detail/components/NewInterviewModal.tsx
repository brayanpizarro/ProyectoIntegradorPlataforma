/**
 * Modal para crear nueva entrevista
 */
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface NuevaEntrevistaModalProps {
  open: boolean;
  onClose: () => void;
  estudianteId: string | number;
}

export function NuevaEntrevistaModal({ open, onClose, estudianteId }: NuevaEntrevistaModalProps) {
  const navigate = useNavigate();

  const handleCrearEntrevista = () => {
    onClose();
    navigate(`/entrevista/${estudianteId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        ➕ Nueva Entrevista
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Fecha"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Entrevistador"
            defaultValue="Usuario Actual"
            required
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Temas Tratados (opcional)"
            placeholder="Ej: Rendimiento académico, situación familiar..."
            fullWidth
          />

          <TextField
            label="Observaciones Generales (opcional)"
            placeholder="Observaciones iniciales de la entrevista..."
            multiline
            rows={4}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleCrearEntrevista} variant="contained" color="primary">
          Crear y Abrir Entrevista
        </Button>
      </DialogActions>
    </Dialog>
  );
}
