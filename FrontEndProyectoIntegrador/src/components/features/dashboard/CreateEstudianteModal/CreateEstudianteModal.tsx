import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { institucionService, estudianteService } from '../../../../services';
import { PersonalDataForm } from './PersonalDataForm';
import { InstitutionForm } from './InstitutionForm';
import { StepperNavigation } from './StepperNavigation';

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
  tipo_de_estudiante: 'media' | 'universitario';
  generacion: string;
  nombre_institucion: string;
  tipo_institucion: string;
  nivel_educativo: string;
  carrera_especialidad: string;
  duracion: string;
  anio_de_ingreso: string;
  anio_de_egreso: string;
}

const STEPS = ['Datos Personales', 'Institución Educativa'];

const INITIAL_FORM_STATE = (generacion: number): FormData => ({
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

export const CreateEstudianteModal: React.FC<CreateEstudianteModalProps> = ({
  open,
  onClose,
  onSuccess,
  generacion
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE(generacion));

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    setError('');

    if (step === 0) {
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
      if (!formData.nombre_institucion.trim()) {
        setError('El nombre de la institución es obligatorio');
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
      // Crear institución
      const institucionData = {
        nombre: formData.nombre_institucion,
        tipo_institucion: formData.tipo_institucion,
        nivel_educativo: formData.nivel_educativo,
        carrera_especialidad: formData.carrera_especialidad,
        duracion: formData.duracion,
        anio_de_ingreso: formData.anio_de_ingreso,
        anio_de_egreso: formData.anio_de_egreso
      };

      const institucion = await institucionService.create(institucionData);

      // Crear estudiante con institución asociada
      const estudianteData = {
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        telefono: formData.telefono,
        fecha_de_nacimiento: formData.fecha_de_nacimiento,
        tipo_de_estudiante: formData.tipo_de_estudiante,
        generacion: formData.generacion,
        id_institucion: institucion.id_institucion
      };

      await estudianteService.create(estudianteData);

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
    setFormData(INITIAL_FORM_STATE(generacion));
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
            {STEPS.map((label) => (
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
            <PersonalDataForm
              formData={{
                nombre: formData.nombre,
                rut: formData.rut,
                email: formData.email,
                telefono: formData.telefono,
                fecha_de_nacimiento: formData.fecha_de_nacimiento,
                tipo_de_estudiante: formData.tipo_de_estudiante
              }}
              onChange={handleFieldChange}
            />
          )}

          {activeStep === 1 && (
            <InstitutionForm
              formData={{
                nombre_institucion: formData.nombre_institucion,
                tipo_institucion: formData.tipo_institucion,
                nivel_educativo: formData.nivel_educativo,
                carrera_especialidad: formData.carrera_especialidad,
                duracion: formData.duracion,
                anio_de_ingreso: formData.anio_de_ingreso,
                anio_de_egreso: formData.anio_de_egreso
              }}
              onChange={handleFieldChange}
            />
          )}
        </Box>
      </DialogContent>

      <StepperNavigation
        activeStep={activeStep}
        totalSteps={STEPS.length}
        loading={loading}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleClose}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
};
