import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Typography
} from '@mui/material';
import { apiService } from '../../../services/apiService';

interface CreateEstudianteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  generacion: number;
}

interface FormData {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  fecha_de_nacimiento: string;
  tipo_de_estudiante: string;
  generacion: string;
}



export function CreateEstudianteModal({
  open,
  onClose,
  onSuccess,
  generacion
}: CreateEstudianteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    fecha_de_nacimiento: '',
    tipo_de_estudiante: 'media',
    generacion: generacion.toString()
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.rut.trim()) {
      setError('El RUT es obligatorio');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Ingresa un email válido');
      return false;
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    if (!formData.fecha_de_nacimiento) {
      setError('La fecha de nacimiento es obligatoria');
      return false;
    }

    return true;
  };



  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const estudianteData = {
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono,
        fecha_de_nacimiento: formData.fecha_de_nacimiento,
        tipo_de_estudiante: formData.tipo_de_estudiante,
        generacion: generacion.toString()
      };

      console.log('📝 Datos a enviar al backend:', estudianteData);

      const nuevoEstudiante = await apiService.createEstudiante(estudianteData);

      console.log('✅ Estudiante creado exitosamente:', nuevoEstudiante);
      console.log('🔄 Llamando onSuccess para actualizar la lista...');

      // Cerrar modal primero
      handleClose();

      // Luego actualizar datos
      onSuccess();
    } catch (err: any) {
      console.error('❌ Error completo al crear estudiante:', err);
      console.error('📄 Respuesta del servidor:', err.response);

      let errorMessage = 'Error al crear el estudiante';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      fecha_de_nacimiento: '',
      tipo_de_estudiante: 'media',
      generacion: generacion.toString()
    });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          👥 Agregar Nuevo Estudiante - Generación {generacion}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Información personal del estudiante
            </Typography>

            <TextField
              fullWidth
              label="Nombre Completo *"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              placeholder="Ej: Juan Pérez González"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="RUT *"
                value={formData.rut}
                onChange={handleChange('rut')}
                placeholder="Ej: 12.345.678-9"
              />

              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="ejemplo@correo.com"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Teléfono *"
                value={formData.telefono}
                onChange={handleChange('telefono')}
                placeholder="+56912345678"
              />

              <TextField
                fullWidth
                label="Fecha de Nacimiento *"
                type="date"
                value={formData.fecha_de_nacimiento}
                onChange={handleChange('fecha_de_nacimiento')}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: 'var(--color-turquoise)',
              '&:hover': {
                bgcolor: 'var(--color-turquoise-dark)'
              }
            }}
          >
            {loading ? 'Guardando...' : 'Crear Estudiante'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
