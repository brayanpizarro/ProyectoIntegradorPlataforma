// =====================================
// SERVICIO DE USUARIOS
// =====================================

import { BaseHttpClient } from './base.http';

class UserService extends BaseHttpClient {
  
  async getAll(): Promise<any[]> {
    return await this.request<any[]>('/users');
  }

  async create(data: any): Promise<any> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<void> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentProfile(): Promise<any> {
    return await this.request('/users/profile');
  }

  async updateCurrentProfile(data: any): Promise<any> {
    return this.request('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const userService = new UserService();
