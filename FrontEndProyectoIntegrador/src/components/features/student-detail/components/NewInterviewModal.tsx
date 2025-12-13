/**
 * Modal para crear nueva entrevista
 */
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  MenuItem,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { entrevistaService, authService } from '../../../../services';
import type {
  CreateEntrevistaDto,
  TipoEntrevista,
  EstadoEntrevista,
} from '../../../../types';

interface NuevaEntrevistaModalProps {
  open: boolean;
  onClose: () => void;
  estudianteId: string | number;
}

export function NuevaEntrevistaModal({ open, onClose, estudianteId }: NuevaEntrevistaModalProps) {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState<string>('');
  const [temas, setTemas] = useState<string>('');
  const [duracionMinutos, setDuracionMinutos] = useState<number>(60);
  const [tipoEntrevista, setTipoEntrevista] = useState<TipoEntrevista>('presencial');
  const [estadoEntrevista, setEstadoEntrevista] = useState<EstadoEntrevista>('completada');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCrearEntrevista = async () => {
    if (submitting) return;

    setError('');
    const user = authService.getCurrentUser();
    if (!user) {
      setError('Debes iniciar sesión para crear una entrevista.');
      return;
    }

    try {
      setSubmitting(true);

      // Calcular siguiente número de entrevista del estudiante
      const entrevistasPrevias = await entrevistaService.getByEstudiante(String(estudianteId));
      const maxNumero = entrevistasPrevias.reduce((max, ent) => {
        const n = ent.numero_entrevista ?? ent.numero_Entrevista;
        return typeof n === 'number' ? Math.max(max, n) : max;
      }, 0);

      // Obtener nombre del tutor
      const nombreTutor = user.nombres && user.apellidos
        ? `${user.nombres} ${user.apellidos}`.trim()
        : user.email || 'Entrevistador';

      // Obtener ID del usuario
      const usuarioId = user.id ? Number(user.id) : 1;

      // Preparar datos para crear entrevista
      const payload: CreateEntrevistaDto = {
        id_estudiante: String(estudianteId),
        id_usuario: usuarioId,
        fecha,
        nombre_tutor: nombreTutor,
        año: new Date(fecha).getFullYear(),
        numero_entrevista: maxNumero + 1,
        duracion_minutos: duracionMinutos,
        tipo_entrevista: tipoEntrevista,
        estado: estadoEntrevista,
        observaciones: observaciones || undefined,
        temas_abordados: temas
          ? temas.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      };

      const entrevistaCreada = await entrevistaService.create(payload);
      const nuevoId = entrevistaCreada.id || estudianteId;

      onClose();
      navigate(`/entrevista/${nuevoId}`);
    } catch (err) {
      console.error('Error creando entrevista', err);
      setError('No se pudo crear la entrevista. Revisa los datos e inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
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
            value={temas}
            onChange={(e) => setTemas(e.target.value)}
            helperText="Separar con comas"
          />

          <TextField
            label="Observaciones Generales (opcional)"
            placeholder="Observaciones iniciales de la entrevista..."
            multiline
            rows={4}
            fullWidth
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />

          <TextField
            label="Duración (minutos)"
            type="number"
            fullWidth
            inputProps={{ min: 15, max: 180, step: 5 }}
            value={duracionMinutos}
            onChange={(e) => setDuracionMinutos(Number(e.target.value) || 60)}
          />

          <TextField
            label="Tipo de entrevista"
            select
            fullWidth
            value={tipoEntrevista}
            onChange={(e) => setTipoEntrevista(e.target.value as TipoEntrevista)}
          >
            <MenuItem value="presencial">Presencial</MenuItem>
            <MenuItem value="virtual">Virtual</MenuItem>
            <MenuItem value="mixta">Mixta</MenuItem>
          </TextField>

          <TextField
            label="Estado"
            select
            fullWidth
            value={estadoEntrevista}
            onChange={(e) => setEstadoEntrevista(e.target.value as EstadoEntrevista)}
          >
            <MenuItem value="programada">Programada</MenuItem>
            <MenuItem value="completada">Completada</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
            <MenuItem value="reprogramada">Reprogramada</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleCrearEntrevista}
          variant="contained"
          disabled={submitting}
          sx={{
            bgcolor: 'var(--color-turquoise)',
            '&:hover': {
              bgcolor: 'var(--color-turquoise-dark)',
            },
          }}
        >
          {submitting ? 'Creando...' : 'Crear y Abrir Entrevista'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
