import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { Usuario } from '../types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface UserProfileProps {}

export const UserProfile: React.FC<UserProfileProps> = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Usuario | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setEditedUser({ ...currentUser });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user! });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user! });
  };

  const handleSave = () => {
    // En un escenario real, aquí se haría la llamada al backend
    // Por ahora, solo actualizamos el estado local
    setUser({ ...editedUser! });
    setIsEditing(false);
    setSnackbarMessage('Perfil actualizado exitosamente');
    setSnackbarOpen(true);
    
    // TODO: Implementar llamada al backend para actualizar el perfil
    // await updateUserProfile(editedUser);
  };

  const handleInputChange = (field: keyof Usuario, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value
      });
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'academico': 'Académico',
      'estudiante': 'Estudiante'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    const colorMap: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'error' } = {
      'admin': 'error',
      'academico': 'primary',
      'estudiante': 'success'
    };
    return colorMap[role] || 'primary';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Cargando perfil...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Error al cargar el perfil del usuario</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            ← Volver
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
            Mi Perfil
          </Typography>
        </Box>

        {/* Main Profile Card */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Profile Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              mb: 4 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Avatar sin imagen */}
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#e3f2fd',
                    fontSize: '2rem'
                  }}
                >
                  <PersonIcon sx={{ fontSize: '2.5rem', color: '#1976d2' }} />
                </Avatar>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {user.nombres && user.apellidos 
                      ? `${user.nombres} ${user.apellidos}`
                      : user.email.split('@')[0]
                    }
                  </Typography>
                  
                  <Chip 
                    label={getRoleDisplayName(user.rol)} 
                    color={getRoleColor(user.rol)}
                    sx={{ mb: 1 }}
                  />
                  
                  {user.rut && (
                    <Typography variant="body2" color="textSecondary">
                      RUT: {user.rut}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Edit Button */}
              <Box>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ borderRadius: 2 }}
                  >
                    Editar
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ borderRadius: 2 }}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Personal Information */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Información Personal
                </Typography>
                {!isEditing && (
                  <IconButton onClick={handleEdit} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                      Nombres
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedUser?.nombres || ''}
                      onChange={(e) => handleInputChange('nombres', e.target.value)}
                      placeholder="Nombres"
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2, ml: 4 }}>
                      {user.nombres || 'No especificado'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                      Apellidos
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedUser?.apellidos || ''}
                      onChange={(e) => handleInputChange('apellidos', e.target.value)}
                      placeholder="Apellidos"
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2, ml: 4 }}>
                      {user.apellidos || 'No especificado'}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                      Email
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="correo@ejemplo.com"
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2, ml: 4 }}>
                      {user.email}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                      Teléfono
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedUser?.telefono || ''}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      placeholder="+56 9 1234 5678"
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2, ml: 4 }}>
                      {user.telefono || 'No especificado'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Address Section */}
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3 
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Dirección
                </Typography>
                {!isEditing && (
                  <IconButton onClick={handleEdit} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="textSecondary" sx={{ minWidth: 80 }}>
                      Dirección
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedUser?.direccion || ''}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      placeholder="Calle, número, comuna, región"
                      multiline
                      rows={2}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mb: 2, ml: 4 }}>
                      {user.direccion || 'No especificada'}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Información de la Cuenta
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    Tipo de Usuario
                  </Typography>
                </Box>
                <Chip 
                  label={getRoleDisplayName(user.rol)} 
                  color={getRoleColor(user.rol)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    Fecha de Registro
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {user.fecha_creacion 
                    ? new Date(user.fecha_creacion).toLocaleDateString('es-CL')
                    : 'No disponible'
                  }
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity="success"
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserProfile;