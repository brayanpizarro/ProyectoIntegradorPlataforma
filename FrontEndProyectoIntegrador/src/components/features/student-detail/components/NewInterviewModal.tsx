/**
 * Modal para crear nueva entrevista
 */
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { entrevistaService } from '../../../../services';
import { authService } from '../../../../services/authService';

interface NuevaEntrevistaModalProps {
  open: boolean;
  onClose: () => void;
  estudianteId: string | number;
}

export function NuevaEntrevistaModal({ open, onClose, estudianteId }: NuevaEntrevistaModalProps) {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState('');
  const [temas, setTemas] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState<number>(60);
  const [tipoEntrevista, setTipoEntrevista] = useState<'presencial' | 'virtual' | 'info_adicional'>('presencial');
  const [estadoEntrevista, setEstadoEntrevista] = useState<'programada' | 'completada' | 'cancelada' | 'reprogramada'>('completada');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = authService.getCurrentUser();
  const [nombreEntrevistador, setNombreEntrevistador] = useState(
    user ? `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.email || 'Entrevistador' : 'Usuario Actual'
  );

  const handleCrearEntrevista = async () => {
    // Prevenir múltiples envíos
    if (isSubmitting) {
      console.log('⚠️ Ya se está procesando una solicitud');
      return;
    }

    setIsSubmitting(true);

    const user = authService.getCurrentUser();
    if (!user) {
      alert('Debes iniciar sesión para crear una entrevista.');
      return;
    }

    try {
      // Calcular siguiente número de entrevista del estudiante
      const entrevistasPrevias = await entrevistaService.getByEstudiante(String(estudianteId));
      const maxNumero = entrevistasPrevias.reduce((max, ent) => {
        const n = (ent as any).numero_entrevista ?? (ent as any).numero_Entrevista;
        return typeof n === 'number' ? Math.max(max, n) : max;
      }, 0);

      // Obtener el ID del usuario actual
      const userId = (user as any)?.id ?? (user as any)?.userId ?? (user as any)?.sub;
      const userIdStr = userId ? String(userId) : '';

      // Validar UUID simple; si no es válido, avisar y detener
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userIdStr)) {
        console.error('❌ id_usuario inválido para entrevista:', userIdStr, user);
        alert('No se pudo obtener un id de usuario válido (UUID). Cierra sesión y vuelve a entrar para intentar nuevamente.');
        setIsSubmitting(false);
        return;
      }

      console.log('📌 ID Usuario para entrevista:', userIdStr, 'Usuario completo:', user);

      // Normalizar fecha a mediodía local para evitar desfase de zona horaria al convertir a ISO
      const fechaLocal = new Date(`${fecha}T12:00:00`);

      // Valores requeridos por el DTO del backend
      const payload = {
        id_estudiante: String(estudianteId),
        id_usuario: userIdStr,
        fecha: fechaLocal.toISOString(),
        nombre_tutor: nombreEntrevistador.trim() || `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.email || 'Entrevistador',
        año: fechaLocal.getFullYear(),
        numero_entrevista: maxNumero + 1,
        duracion_minutos: duracionMinutos,
        tipo_entrevista: tipoEntrevista,
        estado: estadoEntrevista,
        observaciones: observaciones.trim() ? observaciones.trim() : undefined,
        temas_abordados: temas
          ? temas.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      } as const;

      const entrevistaCreada = await entrevistaService.create(payload as any);
      const nuevoId = (entrevistaCreada as any)?.id || (entrevistaCreada as any)?._id || estudianteId;

      onClose();
      navigate(`/entrevista/${nuevoId}`);
    } catch (err) {
      console.error('Error creando entrevista', err);
      alert('No se pudo crear la entrevista. Revisa los datos e inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
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
            value={nombreEntrevistador}
            required
            fullWidth
            onChange={(e) => setNombreEntrevistador(e.target.value)}
          />

          <TextField
            label="Temas a tratar (opcional)"
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
            onChange={(e) => setTipoEntrevista(e.target.value as any)}
            SelectProps={{ native: true }}
          >
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="info_adicional">Información Adicional</option>
          </TextField>

          <TextField
            label="Estado"
            select
            fullWidth
            value={estadoEntrevista}
            onChange={(e) => setEstadoEntrevista(e.target.value as any)}
            SelectProps={{ native: true }}
          >
            <option value="programada">Programada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
            <option value="reprogramada">Reprogramada</option>
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleCrearEntrevista} variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear y Abrir Entrevista'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
