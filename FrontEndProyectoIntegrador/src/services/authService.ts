import axios from 'axios';
import type { Usuario, LoginCredentials, AuthResponse } from '../types';

const API_URL = 'http://localhost:3000';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // MOCK: Simular respuestas del backend para desarrollo
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      const config = error.config;
      
      // Mock login responses
      if (config.url === '/auth/login' && config.method === 'post') {
        const credentials = JSON.parse(config.data);
        
        // Usuarios mock
        const mockUsers = {
          'estudiante@fundacion.cl': {
            id: '1',
            nombres: 'Juan Carlos',
            apellidos: 'Pérez González',
            email: 'estudiante@fundacion.cl',
            rut: '12345678-9',
            tipo: 'estudiante' as const,
            telefono: '+56912345678',
            direccion: 'Av. Principal 123, Santiago'
          },
          'admin@fundacion.cl': {
            id: '2',
            nombres: 'María José',
            apellidos: 'Rodríguez Silva',
            email: 'admin@fundacion.cl',
            rut: '98765432-1',
            tipo: 'admin' as const,
            telefono: '+56987654321',
            direccion: 'Calle Admin 456, Santiago'
          },
          'academico@fundacion.cl': {
            id: '3',
            nombres: 'Carlos Eduardo',
            apellidos: 'López Torres',
            email: 'academico@fundacion.cl',
            rut: '11223344-5',
            tipo: 'academico' as const,
            telefono: '+56911223344',
            direccion: 'Av. Académica 789, Santiago'
          }
        };
        
        if (credentials.email in mockUsers && credentials.password === 'admin123') {
          const usuario = mockUsers[credentials.email as keyof typeof mockUsers];
          return Promise.resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              usuario
            }
          });
        } else {
          return Promise.reject(new Error('Credenciales inválidas'));
        }
      }
      
      // Mock login admin
      if (config.url === '/auth/login/admin' && config.method === 'post') {
        const credentials = JSON.parse(config.data);
        
        if ((credentials.email === 'admin@fundacion.cl' || credentials.email === 'academico@fundacion.cl') 
            && credentials.password === 'admin123') {
          const isAdmin = credentials.email === 'admin@fundacion.cl';
          return Promise.resolve({
            data: {
              token: 'mock-jwt-token-admin-' + Date.now(),
              usuario: isAdmin ? {
                id: '2',
                nombres: 'María José',
                apellidos: 'Rodríguez Silva',
                email: 'admin@fundacion.cl',
                rut: '98765432-1',
                tipo: 'admin' as const,
                telefono: '+56987654321',
                direccion: 'Calle Admin 456, Santiago'
              } : {
                id: '3',
                nombres: 'Carlos Eduardo',
                apellidos: 'López Torres',
                email: 'academico@fundacion.cl',
                rut: '11223344-5',
                tipo: 'academico' as const,
                telefono: '+56911223344',
                direccion: 'Av. Académica 789, Santiago'
              }
            }
          });
        } else {
          return Promise.reject(new Error('Credenciales inválidas'));
        }
      }
      
      // Mock profile endpoint
      if (config.url === '/auth/profile' && config.method === 'get') {
        const user = localStorage.getItem('user');
        if (user) {
          return Promise.resolve({
            data: JSON.parse(user)
          });
        }
        return Promise.reject(new Error('No autorizado'));
      }
      
      // Mock password recovery endpoints
      if (config.url === '/auth/request-password-reset') {
        return Promise.resolve({ data: { message: 'Código enviado' } });
      }
      
      if (config.url === '/auth/verify-reset-code') {
        const { code } = JSON.parse(config.data);
        return Promise.resolve({ data: { valid: code === '123456' } });
      }
      
      if (config.url === '/auth/reset-password') {
        return Promise.resolve({ data: { message: 'Contraseña actualizada' } });
      }
    }
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login general
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('🔐 Iniciando sesión con:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      console.log('✅ Login exitoso para:', data.usuario.tipo);
      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  },

  // Login específico para admin
  loginAdmin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('👨‍💼 Iniciando sesión de admin con:', credentials.email);
      const response = await api.post('/auth/login/admin', credentials);
      const data = response.data;
      
      if (data.usuario.tipo !== 'admin') {
        throw new Error('Usuario no es administrador');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      console.log('✅ Login admin exitoso');
      return data;
    } catch (error) {
      console.error('❌ Error en login admin:', error);
      throw error;
    }
  },

  // Obtener perfil del usuario
  getProfile: async (): Promise<Usuario> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener token actual
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Obtener usuario actual
  getCurrentUser: (): Usuario | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Verificar si es admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'admin';
  },

  // Verificar si es académico
  isAcademico: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'academico';
  },

  // Verificar si es estudiante
  isEstudiante: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'estudiante';
  },

  // Actualizar perfil
  updateProfile: async (userData: Partial<Usuario>): Promise<Usuario> => {
    try {
      const response = await api.patch('/auth/profile', userData);
      
      // Actualizar usuario en localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.patch('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      throw error;
    }
  },

  // Solicitar recuperación de contraseña
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/request-password-reset', { email });
    } catch (error) {
      console.error('❌ Error solicitando recuperación:', error);
      throw error;
    }
  },

  // Verificar código de recuperación
  verifyResetCode: async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      return response.data.valid;
    } catch (error) {
      console.error('❌ Error verificando código:', error);
      throw error;
    }
  },

  // Restablecer contraseña
  resetPassword: async (email: string, code: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
    } catch (error) {
      console.error('❌ Error restableciendo contraseña:', error);
      throw error;
    }
  }
};

export default authService;