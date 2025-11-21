import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { PermissionService } from '../services/permissionService';
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
  Visibility as VisibilityIcon
} from '@mui/icons-material';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [tabValue, setTabValue] = useState<'todos' | 'tutores' | 'invitados'>('todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    rut: '',
    telefono: '',
    rol: 'tutor' as 'tutor' | 'invitado'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [tabValue, users]);

  const loadData = () => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const user = authService.getCurrentUser();
    if (!PermissionService.canManageUsers(user)) {
      navigate('/dashboard');
      return;
    }

    setCurrentUser(user);
    loadUsers();
  };

  const loadUsers = () => {
    // TODO: Reemplazar con llamada real al backend
    const mockUsers: Usuario[] = [
      {
        id: '1',
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.tutor@fundacion.cl',
        rol: 'tutor',
        rut: '12345678-9',
        telefono: '+56912345678',
        activo: true,
        fecha_creacion: '2024-01-15'
      },
      {
        id: '2',
        nombres: 'María',
        apellidos: 'González',
        email: 'maria.invitado@fundacion.cl',
        rol: 'invitado',
        rut: '98765432-1',
        telefono: '+56987654321',
        activo: true,
        fecha_creacion: '2024-02-20'
      }
    ];

    setUsers(mockUsers);
  };

  const filterUsers = () => {
    if (tabValue === 'todos') {
      setFilteredUsers(users);
    } else if (tabValue === 'tutores') {
      setFilteredUsers(users.filter(u => u.rol === 'tutor'));
    } else {
      setFilteredUsers(users.filter(u => u.rol === 'invitado'));
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
        rol: user.rol as 'tutor' | 'invitado'
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
      // TODO: Implementar llamada al backend
      if (editingUser) {
        // Actualizar usuario existente
        const updatedUsers = users.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...formData, tipo: formData.rol }
            : u
        );
        setUsers(updatedUsers);
        setSnackbar({ open: true, message: 'Usuario actualizado exitosamente', severity: 'success' });
      } else {
        // Crear nuevo usuario
        const newUser: Usuario = {
          id: Date.now().toString(),
          ...formData,
          tipo: formData.rol,
          activo: true,
          fecha_creacion: new Date().toISOString(),
          creado_por: currentUser?.id
        };
        setUsers([...users, newUser]);
        setSnackbar({ open: true, message: `${formData.rol === 'tutor' ? 'Tutor' : 'Invitado'} creado exitosamente`, severity: 'success' });
      }
      
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar el usuario', severity: 'error' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      // TODO: Implementar llamada al backend
      setUsers(users.filter(u => u.id !== userId));
      setSnackbar({ open: true, message: 'Usuario eliminado exitosamente', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar el usuario', severity: 'error' });
    }
  };

  const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    const colorMap: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' } = {
      'admin': 'error',
      'tutor': 'primary',
      'invitado': 'info'
    };
    return colorMap[role] || 'secondary';
  };

  const getRoleIcon = (role: string) => {
    if (role === 'tutor') return <TutorIcon />;
    if (role === 'invitado') return <VisibilityIcon />;
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
              label={`Tutores (${users.filter(u => u.rol === 'tutor').length})`} 
              value="tutores"
              icon={<TutorIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Invitados (${users.filter(u => u.rol === 'invitado').length})`} 
              value="invitados"
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
                          {getRoleIcon(user.rol)}
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
                        label={user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                        color={getRoleColor(user.rol)}
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
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'tutor' | 'invitado' })}
                  label="Rol *"
                >
                  <MenuItem value="tutor">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TutorIcon /> Tutor
                    </Box>
                  </MenuItem>
                  <MenuItem value="invitado">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon /> Invitado
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