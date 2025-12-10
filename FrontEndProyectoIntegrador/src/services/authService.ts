// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE AUTENTICACIÓN CON MOCKS PARA DESARROLLO
// ════════════════════════════════════════════════════════════════════════════
// Este archivo maneja el login y autenticación del usuario.
// Si el backend NO está disponible, usa AUTENTICACIÓN MOCK automáticamente.
//
// ✅ CÓMO REMOVER LOS MOCKS CUANDO TENGAS BACKEND:
//    1. Busca: "// ▼ MOCK LOGIN" y "// ▲ FIN MOCK LOGIN"
//    2. Elimina el método private mockLogin()
//    3. Elimina los try-catch que llaman a mockLogin()
//    4. Deja solo: const authResponse: AuthResponse = await response.json();
//
// MOCKS ACTUALMENTE ACTIVOS (eliminar cuando backend esté listo):
//   ✓ mockLogin() - Login de prueba sin validar contra base de datos
// ════════════════════════════════════════════════════════════════════════════

import type { LoginCredentials, AuthResponse, Usuario } from '../types';

const API_BASE_URL = 'http://localhost:3000'; // TODO Backend: Configurar CORS para este origen

class AuthService {
  private currentUser: Usuario | null = null;

  /**
   * Verificar si el usuario está autenticado
   * Valida token en localStorage y opcionalmente con el backend
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accesstoken');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }

    // TODO Backend: Opcional - validar token con el backend
    // this.validateTokenWithBackend(token);
    
    return true;
  }

  /**
   * Obtener token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem('accesstoken');
  }


  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 Intentando login con:', credentials.email);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const authResponse: AuthResponse = await response.json();
        
        // Guardar datos en localStorage
        this.saveAuthData(authResponse);
        
        console.log('✅ Login exitoso con backend real');
        console.log('👤 Usuario:', authResponse.user.email, '- Rol:', authResponse.user.role);
        return authResponse;
      } else if (response.status === 401) {
        throw new Error('Credenciales inválidas');
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ Backend no disponible, usando autenticación mock');
      console.warn('📝 Error original:', error);
      
      // FALLBACK: Usar autenticación MOCK para desarrollo
      const authResponse = await this.mockLogin(credentials);
      this.saveAuthData(authResponse);
      
      console.log('✅ [MOCK] Login exitoso');
      console.log('👤 Usuario:', authResponse.user.email, '- Rol:', authResponse.user.role);
      console.log('⚠️ Nota: Esto es un LOGIN MOCK. El backend no está disponible.');
      
      return authResponse;
    }
  }

  /**
   * Login específico para admin (mantiene compatibilidad)
   */
  async loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
    const result = await this.login(credentials);
    
    // Verificar que sea admin
    if (result.user.role !== 'admin') {
      throw new Error('Acceso denegado: se requieren permisos de administrador');
    }
    
    return result;
  }

  /**
   * Cerrar sesión
   * TODO Backend: Implementar POST /auth/logout para invalidar token
   */
  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        // Intentar logout en el backend
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Logout exitoso en backend');
      } catch (error) {
        console.warn('⚠️ No se pudo notificar logout al backend:', error);
      }
    }

    // Limpiar datos locales
    this.clearAuthData();
    console.log('🚪 Sesión cerrada localmente');
  }

  getCurrentUser(): Usuario | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }

    return null;
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Solicitar restablecimiento de contraseña
   * TODO Backend: Implementar POST /auth/forgot-password
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar código de recuperación');
      }

      console.log('✅ Código de recuperación enviado');
    } catch (error) {
      console.error('❌ Error al enviar código:', error);
      throw new Error('No se pudo enviar el código de recuperación');
    }
  }

  /**
   * Verificar código de recuperación
   * TODO Backend: Implementar POST /auth/verify-reset-code
   */
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();
      return result.valid;
    } catch (error) {
      console.error('❌ Error al verificar código:', error);
      throw new Error('No se pudo verificar el código');
    }
  }

  /**
   * Restablecer contraseña
   * TODO Backend: Implementar POST /auth/reset-password
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer contraseña');
      }

      console.log('✅ Contraseña restablecida exitosamente');
    } catch (error) {
      console.error('❌ Error al restablecer contraseña:', error);
      throw new Error('No se pudo restablecer la contraseña');
    }
  }

  // ================================
  // MÉTODOS PRIVADOS Y HELPERS
  // ================================

  /**
   * Guardar datos de autenticación en localStorage
   */
  private saveAuthData(authResponse: AuthResponse): void {
    // Mapear 'rol' del backend a 'role' del frontend si es necesario
    const userToSave = { ...authResponse.user };
    const userAny = userToSave as Record<string, unknown>;
    if (!userToSave.role && userAny.rol) {
      userToSave.role = userAny.rol as 'admin' | 'tutor' | 'invitado' | 'academico' | 'estudiante';
    }
    
    localStorage.setItem('accesstoken', authResponse.accessToken);
    localStorage.setItem('refreshtoken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(userToSave));
    this.currentUser = userToSave;
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuthData(): void {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    this.currentUser = null;
  }

  /**
   * Validar token con el backend (futuro)
   * TODO Backend: Implementar GET /auth/validate-token
   */
  /*
  private async validateTokenWithBackend(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.warn('No se pudo validar token con backend:', error);
      return true; // En desarrollo, asumir que es válido
    }
  }
  */

  // ════════════════════════════════════════════════════════════════════════════
  // ▼▼▼ SECCIÓN DE MOCKS PARA DESARROLLO - ELIMINAR CUANDO BACKEND ESTÉ LISTO ▼▼▼
  // ════════════════════════════════════════════════════════════════════════════
  // Este mock simula un login exitoso sin validar contra base de datos
  // Cuando el backend esté listo, elimina este método
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * Login MOCK para desarrollo - ELIMINAR cuando backend esté listo
   * Acepta cualquier email/password y genera tokens fake
   */
  private mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 [MOCK] Login sin validación de BD:', credentials.email);
    
    // Mock user - cambia según email para demostración
    const mockUsers: { [key: string]: Usuario } = {
      'admin@test.com': {
        id: '1',
        email: 'admin@test.com',
        nombre: 'Admin User',
        role: 'admin',
        tipo: 'admin',
      },
      'academico@test.com': {
        id: '2',
        email: 'academico@test.com',
        nombre: 'Profesor Académico',
        role: 'academico',
        tipo: 'academico',
      },
      'estudiante@test.com': {
        id: '3',
        email: 'estudiante@test.com',
        nombre: 'Juan Estudiante',
        role: 'estudiante',
        tipo: 'estudiante',
      },
    };

    const mockUser = mockUsers[credentials.email] || {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      nombre: 'Mock User',
      role: 'invitado',
      tipo: 'invitado',
    };

    const authResponse: AuthResponse = {
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: mockUser,
    };

    console.log('✅ [MOCK] Login exitoso, usuario:', mockUser.email);
    return Promise.resolve(authResponse);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ▲▲▲ FIN SECCIÓN DE MOCKS - ELIMINAR CUANDO BACKEND ESTÉ LISTO ▲▲▲
  // ════════════════════════════════════════════════════════════════════════════
}

// Exportar instancia singleton
export const authService = new AuthService();

// Mantener compatibilidad con exports anteriores
export default authService;