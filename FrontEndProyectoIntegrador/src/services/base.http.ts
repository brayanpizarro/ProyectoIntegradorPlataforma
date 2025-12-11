const API_BASE_URL = 'http://localhost:3000';

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export class BaseHttpClient {
  protected async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('accesstoken');
    if (token && options.requireAuth !== false) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    // Interceptar 401 para limpiar token expirado
    if (response.status === 401 && token) {
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshtoken');
      window.location.href = '/';
      return;
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  }
}
