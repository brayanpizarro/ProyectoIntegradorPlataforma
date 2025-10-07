// Servicio de autenticación simplificado para desarrollo sin backend

export const authService = {
  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obtener token (método que faltaba)
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Login simplificado
  login: (credentials: any) => {
    console.log('🔐 Intentando login con:', credentials.email);
    
    // Credenciales válidas
    const validCredentials = [
      { email: 'admin@fundacion.cl', password: 'admin123', tipo: 'admin' },
      { email: 'academico@fundacion.cl', password: 'admin123', tipo: 'academico' },
      { email: 'estudiante@fundacion.cl', password: 'admin123', tipo: 'estudiante' }
    ];

    const user = validCredentials.find(
      cred => cred.email === credentials.email && cred.password === credentials.password
    );

    if (user) {
      const token = 'mock-jwt-token-' + Date.now();
      const userData = {
        id: Date.now().toString(),
        nombres: 'Usuario',
        apellidos: 'Prueba',
        email: user.email,
        tipo: user.tipo,
        rut: '12345678-9'
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Login exitoso');
      return Promise.resolve({ token, usuario: userData });
    } else {
      console.log('❌ Credenciales inválidas');
      return Promise.reject(new Error('Credenciales inválidas'));
    }
  },

  // Login admin (mismo comportamiento)
  loginAdmin: (credentials: any) => {
    return authService.login(credentials);
  },

  // Cerrar sesión
  logout: () => {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si es admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'admin';
  },

  // Funciones adicionales simplificadas
  requestPasswordReset: (email: string) => {
    console.log('📧 Enviando código a:', email);
    return Promise.resolve();
  },

  verifyResetCode: (email: string, code: string) => {
    console.log('🔢 Verificando código:', code);
    return Promise.resolve(code === '123456');
  },

  resetPassword: (email: string, code: string, newPassword: string) => {
    console.log('🔑 Restableciendo contraseña');
    return Promise.resolve();
  }
};

export default authService;