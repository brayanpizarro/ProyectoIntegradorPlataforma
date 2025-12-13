import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, userService, PermissionService } from '../services';
import type { Usuario } from '../types';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SupervisorAccount as TutorIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon
} from '@mui/icons-material';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [tabValue, setTabValue] = useState<'todos' | 'tutores' | 'visitas'>('todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordUser, setPasswordUser] = useState<Usuario | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    rut: '',
    telefono: '',
    rol: 'tutor' as 'tutor' | 'visita'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [tabValue, users]);

  const loadData = async () => {
    if (!authService.isAuthenticated()) {
      console.log('No autenticado, redirigiendo al login');
      navigate('/');
      return;
    }

    // Verificar que el token sea válido
    const tokenValid = await authService.verifyToken();
    if (!tokenValid) {
      //console.log('Token inválido o expirado, redirigiendo al login');
      navigate('/');
      return;
    }

    const user = authService.getCurrentUser();
  /*
   console.log('Usuario actual completo:', JSON.stringify(user, null, 2));
   console.log('¿Es admin?', PermissionService.isAdmin(user));
   console.log('¿Puede gestionar usuarios?', PermissionService.canManageUsers(user));
  */ 
    // Dar tiempo para que el usuario vea el mensaje
    if (!PermissionService.canManageUsers(user)) {
      console.error('🚫 Usuario sin permisos de administrador');
      setSnackbar({ 
        open: true, 
        message: 'No tienes permisos para acceder a esta sección. Debes ser administrador.', 
        severity: 'error' 
      });
      // Aumentar el tiempo para que el usuario pueda ver el error
      setTimeout(() => {
        console.log('⏰ Redirigiendo al dashboard por falta de permisos...');
        navigate('/dashboard');
      }, 3000);
      return;
    }

    //console.log('Usuario con permisos, cargando usuarios...');
    await loadUsers();
  };

  const loadUsers = async () => {
    try {
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setSnackbar({ open: true, message: 'Error al cargar usuarios', severity: 'error' });
    }
  };

  const filterUsers = () => {
    if (tabValue === 'todos') {
      setFilteredUsers(users);
    } else if (tabValue === 'tutores') {
      setFilteredUsers(users.filter(u => u.role === 'tutor'));
    } else {
      setFilteredUsers(users.filter(u => u.role === 'invitado'));
    }
  };

  const handleOpenDialog = (user?: Usuario) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombres: user.nombres || '',
        apellidos: user.apellidos || '',
        email: user.email,
        password: '',
        rut: user.rut || '',
        telefono: user.telefono || '',
        rol: user.role as 'tutor' | 'visita'
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        rut: '',
        telefono: '',
        rol: 'tutor'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      rut: '',
      telefono: '',
      rol: 'tutor'
    });
  };

  const handleSaveUser = async () => {
    // Validaciones
    if (!formData.nombres || !formData.apellidos || !formData.email) {
      setSnackbar({ open: true, message: 'Por favor completa los campos obligatorios', severity: 'error' });
      return;
    }

    if (!editingUser && !formData.password) {
      setSnackbar({ open: true, message: 'La contraseña es obligatoria para nuevos usuarios', severity: 'error' });
      return;
    }

    try {
      // Mapear datos del frontend al formato del backend
      const userData = {
        username: formData.email, // Usar email como username
        nombre: formData.nombres,
        apellido: formData.apellidos,
        email: formData.email,
        password: formData.password,
        rol: formData.rol, // El backend espera 'tutor' o 'visita' en minúsculas
        activo: true
      };

      console.log('📤 Enviando datos de usuario:', userData);

      if (editingUser) {
        // Actualizar usuario existente
        const updateData: any = { ...userData };
        if (!updateData.password) {
          updateData.password = undefined; // Marcar como undefined si está vacío
        }
        await userService.update(editingUser.id!, updateData);
        setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' });
      } else {
        // Crear nuevo usuario
        await userService.create(userData);
        setSnackbar({ open: true, message: `${formData.rol === 'tutor' ? 'Tutor' : 'Visitante'} creado exitosamente`, severity: 'success' });
      }
      
      handleCloseDialog();
      await loadUsers(); // Recargar lista
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el usuario';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await userService.delete(userId);
      setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' });
      await loadUsers(); // Recargar lista
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setSnackbar({ open: true, message: 'Error al eliminar el usuario', severity: 'error' });
    }
  };

  const handleOpenPasswordDialog = (user: Usuario) => {
    setPasswordUser(user);
    setNewPassword('');
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPasswordUser(null);
    setNewPassword('');
  };

  const handleChangePassword = async () => {
    if (!passwordUser || !newPassword.trim()) {
      setSnackbar({ open: true, message: 'Por favor ingresa una nueva contraseña', severity: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setSnackbar({ open: true, message: 'La contraseña debe tener al menos 6 caracteres', severity: 'error' });
      return;
    }

    try {
      await userService.changeUserPassword(passwordUser.id!, newPassword);
      setSnackbar({ open: true, message: 'Contraseña actualizada exitosamente', severity: 'success' });
      handleClosePasswordDialog();
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setSnackbar({ open: true, message: 'Error al cambiar la contraseña', severity: 'error' });
    }
  };

  const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    const colorMap: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' } = {
      'admin': 'error',
      'tutor': 'primary',
      'visita': 'info'
    };
    return colorMap[role] || 'secondary';
  };

  const getRoleIcon = (role: string) => {
    if (role === 'tutor') return <TutorIcon />;
    if (role === 'visita') return <VisibilityIcon />;
    return <PersonIcon />;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/dashboard')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              ← Volver
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
              👥 Gestión de Usuarios
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Agregar Usuario
          </Button>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label={`Todos (${users.length})`} value="todos" />
            <Tab 
              label={`Tutores (${users.filter(u => u.role === 'tutor').length})`} 
              value="tutores"
              icon={<TutorIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Visitas (${users.filter(u => u.role === 'invitado').length})`} 
              value="visitas"
              icon={<VisibilityIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      No hay usuarios registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#e3f2fd' }}>
                          {getRoleIcon(user.role || '')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {user.nombres} {user.apellidos}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.fecha_creacion && `Desde ${new Date(user.fecha_creacion).toLocaleDateString('es-CL')}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.rut || '-'}</TableCell>
                    <TableCell>{user.telefono || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={(user.role || '').charAt(0).toUpperCase() + (user.role || '').slice(1)}
                        color={getRoleColor(user.role || '')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.activo ? 'Activo' : 'Inactivo'}
                        color={user.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="warning"
                        onClick={() => handleOpenPasswordDialog(user)}
                      >
                        <LockIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog para Crear/Editar Usuario */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombres *"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                fullWidth
              />
              <TextField
                label="Apellidos *"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
              />
              {!editingUser && (
                <TextField
                  label="Contraseña *"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  fullWidth
                  helperText="Mínimo 6 caracteres"
                />
              )}
              <TextField
                label="RUT"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                placeholder="12345678-9"
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56912345678"
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Rol *</InputLabel>
                <Select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'tutor' | 'visita' })}
                  label="Rol *"
                >
                  <MenuItem value="tutor">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TutorIcon /> Tutor
                    </Box>
                  </MenuItem>
                  <MenuItem value="visita">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon /> Visita
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={handleSaveUser}
              disabled={!formData.nombres || !formData.apellidos || !formData.email}
            >
              {editingUser ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para Cambiar Contraseña */}
        <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Cambiar Contraseña - {passwordUser?.nombres} {passwordUser?.apellidos}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                type="password"
                label="Nueva Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                helperText="La contraseña debe tener al menos 6 caracteres"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleChangePassword}
              disabled={!newPassword.trim() || newPassword.length < 6}
            >
              Cambiar Contraseña
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserManagement;