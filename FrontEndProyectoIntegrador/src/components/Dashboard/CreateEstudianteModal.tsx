import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Typography,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { apiService } from '../../services/apiService';

interface CreateEstudianteModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  generacion: number;
}

interface FormData {
  // Datos personales
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  fecha_de_nacimiento: string;
  tipo_de_estudiante: 'media' | 'universitario';
  generacion: string;
  
  // Datos institución
  nombre_institucion: string;
  tipo_institucion: string;
  nivel_educativo: string;
  carrera_especialidad: string;
  duracion: string;
  anio_de_ingreso: string;
  anio_de_egreso: string;
}

const steps = ['Datos Personales', 'Institución Educativa'];

export const CreateEstudianteModal: React.FC<CreateEstudianteModalProps> = ({
  open,
  onClose,
  onSuccess,
  generacion
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    fecha_de_nacimiento: '',
    tipo_de_estudiante: 'universitario',
    generacion: generacion.toString(),
    nombre_institucion: '',
    tipo_institucion: 'Universidad',
    nivel_educativo: 'Superior',
    carrera_especialidad: '',
    duracion: '',
    anio_de_ingreso: generacion.toString(),
    anio_de_egreso: ''
  });

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateStep = (step: number): boolean => {
    setError('');

    if (step === 0) {
      // Validar datos personales
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
      if (!formData.fecha_de_nacimiento) {
        setError('La fecha de nacimiento es obligatoria');
        return false;
      }
    } else if (step === 1) {
      // Validar datos institución
      if (!formData.nombre_institucion.trim()) {
        setError('El nombre de la institución es obligatorio');
        return false;
      }
      if (!formData.tipo_institucion.trim()) {
        setError('El tipo de institución es obligatorio');
        return false;
      }
      if (!formData.nivel_educativo.trim()) {
        setError('El nivel educativo es obligatorio');
        return false;
      }
      if (!formData.carrera_especialidad.trim()) {
        setError('La carrera/especialidad es obligatoria');
        return false;
      }
      if (!formData.duracion.trim()) {
        setError('La duración es obligatoria');
        return false;
      }
      if (!formData.anio_de_ingreso) {
        setError('El año de ingreso es obligatorio');
        return false;
      }
      if (!formData.anio_de_egreso) {
        setError('El año de egreso es obligatorio');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Primero crear la institución
      const institucionData = {
        nombre: formData.nombre_institucion,
        tipo_institucion: formData.tipo_institucion,
        nivel_educativo: formData.nivel_educativo,
        carrera_especialidad: formData.carrera_especialidad,
        duracion: formData.duracion,
        anio_de_ingreso: formData.anio_de_ingreso,
        anio_de_egreso: formData.anio_de_egreso
      };

      const institucion = await apiService.request('/institucion', {
        method: 'POST',
        body: JSON.stringify(institucionData)
      });

      // Crear el estudiante con la institución
      const estudianteData = {
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono,
        fecha_de_nacimiento: formData.fecha_de_nacimiento,
        tipo: formData.tipo_de_estudiante,
        generacion: formData.generacion,
        institucionId: institucion.id_institucion
      };

      await apiService.request('/estudiante', {
        method: 'POST',
        body: JSON.stringify(estudianteData)
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Error al crear estudiante:', err);
      setError(err.message || 'Error al crear el estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      fecha_de_nacimiento: '',
      tipo_de_estudiante: 'universitario',
      generacion: generacion.toString(),
      nombre_institucion: '',
      tipo_institucion: 'Universidad',
      nivel_educativo: 'Superior',
      carrera_especialidad: '',
      duracion: '',
      anio_de_ingreso: generacion.toString(),
      anio_de_egreso: ''
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
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Información personal del estudiante
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre Completo *"
                  value={formData.nombre}
                  onChange={handleChange('nombre')}
                  placeholder="Ej: Juan Pérez González"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RUT *"
                  value={formData.rut}
                  onChange={handleChange('rut')}
                  placeholder="Ej: 12.345.678-9"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="ejemplo@correo.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange('telefono')}
                  placeholder="+56912345678"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento *"
                  type="date"
                  value={formData.fecha_de_nacimiento}
                  onChange={handleChange('fecha_de_nacimiento')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Estudiante *"
                  value={formData.tipo_de_estudiante}
                  onChange={handleChange('tipo_de_estudiante')}
                >
                  <MenuItem value="media">Enseñanza Media</MenuItem>
                  <MenuItem value="universitario">Universitario</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Información de la institución educativa
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Institución *"
                  value={formData.nombre_institucion}
                  onChange={handleChange('nombre_institucion')}
                  placeholder="Ej: Universidad de Chile"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo de Institución *"
                  value={formData.tipo_institucion}
                  onChange={handleChange('tipo_institucion')}
                >
                  <MenuItem value="Universidad">Universidad</MenuItem>
                  <MenuItem value="Instituto Profesional">Instituto Profesional</MenuItem>
                  <MenuItem value="Centro de Formación Técnica">Centro de Formación Técnica</MenuItem>
                  <MenuItem value="Liceo">Liceo</MenuItem>
                  <MenuItem value="Colegio">Colegio</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Nivel Educativo *"
                  value={formData.nivel_educativo}
                  onChange={handleChange('nivel_educativo')}
                >
                  <MenuItem value="Media">Enseñanza Media</MenuItem>
                  <MenuItem value="Superior">Educación Superior</MenuItem>
                  <MenuItem value="Técnico">Técnico</MenuItem>
                  <MenuItem value="Profesional">Profesional</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Carrera / Especialidad *"
                  value={formData.carrera_especialidad}
                  onChange={handleChange('carrera_especialidad')}
                  placeholder="Ej: Ingeniería Civil, Administración, etc."
                  helperText="Nombre de la carrera o especialidad que estudia"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Duración *"
                  value={formData.duracion}
                  onChange={handleChange('duracion')}
                  placeholder="Ej: 5 años"
                  helperText="Duración total del programa"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Año de Ingreso *"
                  type="number"
                  value={formData.anio_de_ingreso}
                  onChange={handleChange('anio_de_ingreso')}
                  placeholder="2024"
                  inputProps={{ min: 2000, max: 2030 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Año de Egreso *"
                  type="number"
                  value={formData.anio_de_egreso}
                  onChange={handleChange('anio_de_egreso')}
                  placeholder="2029"
                  inputProps={{ min: 2000, max: 2040 }}
                  helperText="Año estimado de egreso"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} disabled={loading}>
              Atrás
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              variant="contained"
              sx={{
                bgcolor: 'var(--color-turquoise)',
                '&:hover': {
                  bgcolor: 'var(--color-turquoise-dark)'
                }
              }}
            >
              Siguiente
            </Button>
          ) : (
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
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
