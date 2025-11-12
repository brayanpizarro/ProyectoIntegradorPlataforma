import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Ramo {
  codigo: string;
  nombre: string;
  creditos: number;
  prerequisitos: string[];
  estado: 'pendiente' | 'cursando' | 'aprobado' | 'reprobado';
  nota?: number;
}

interface AddSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (nuevoRamo: Ramo) => void;
  semestre: number;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  open,
  onClose,
  onSave,
  semestre
}) => {
  const [formData, setFormData] = useState<Ramo>({
    codigo: '',
    nombre: '',
    creditos: 5,
    prerequisitos: [],
    estado: 'pendiente'
  });

  const handleSave = () => {
    if (formData.codigo && formData.nombre) {
      onSave(formData);
      // Limpiar formulario
      setFormData({
        codigo: '',
        nombre: '',
        creditos: 5,
        prerequisitos: [],
        estado: 'pendiente'
      });
      onClose();
    }
  };

  const handleClose = () => {
    // Limpiar formulario al cerrar
    setFormData({
      codigo: '',
      nombre: '',
      creditos: 5,
      prerequisitos: [],
      estado: 'pendiente'
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        backgroundColor: '#e8f5e8',
        borderBottom: '1px solid #4caf50'
      }}>
        <AddIcon color="success" />
        Agregar Nueva Materia - Semestre {semestre}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Código del ramo */}
          <TextField
            fullWidth
            label="Código del Ramo *"
            placeholder="Ej: DCCB-00106"
            value={formData.codigo}
            onChange={(e) => setFormData({
              ...formData,
              codigo: e.target.value.toUpperCase()
            })}
            helperText="Código único identificador del ramo"
          />

          {/* Nombre del ramo */}
          <TextField
            fullWidth
            label="Nombre del Ramo *"
            placeholder="Ej: Cálculo I"
            value={formData.nombre}
            onChange={(e) => setFormData({
              ...formData,
              nombre: e.target.value
            })}
            helperText="Nombre completo de la materia"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Créditos */}
            <TextField
              fullWidth
              type="number"
              label="Créditos SCT"
              value={formData.creditos}
              onChange={(e) => setFormData({
                ...formData,
                creditos: parseInt(e.target.value) || 0
              })}
              inputProps={{ 
                min: 1, 
                max: 12
              }}
              helperText="Créditos académicos"
            />

            {/* Estado inicial */}
            <FormControl fullWidth>
              <InputLabel>Estado Inicial</InputLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({
                  ...formData,
                  estado: e.target.value as typeof formData.estado
                })}
                label="Estado Inicial"
              >
                <MenuItem value="pendiente">⏳ Pendiente</MenuItem>
                <MenuItem value="cursando">📚 Cursando</MenuItem>
                <MenuItem value="aprobado">✅ Aprobado</MenuItem>
                <MenuItem value="reprobado">❌ Reprobado</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Nota (si está aprobado o reprobado) */}
          {(formData.estado === 'aprobado' || formData.estado === 'reprobado') && (
            <TextField
              fullWidth
              type="number"
              label="Nota Final"
              value={formData.nota || ''}
              onChange={(e) => setFormData({
                ...formData,
                nota: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              inputProps={{ 
                min: 1.0, 
                max: 7.0, 
                step: 0.1 
              }}
              helperText="Escala de 1.0 a 7.0"
            />
          )}

          {/* Vista previa */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            border: '1px dashed #ccc'
          }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Vista previa:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {formData.codigo || 'CÓDIGO-XXXX'}
              </Typography>
              <Typography variant="body2">
                {formData.nombre || 'Nombre del ramo'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip label={formData.estado} size="small" />
                <Typography variant="caption">
                  {formData.creditos} SCT
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          color="inherit"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
          disabled={!formData.codigo || !formData.nombre}
        >
          Agregar Materia
        </Button>
      </DialogActions>
    </Dialog>
  );
};