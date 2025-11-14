// Helper para verificar permisos según el rol del usuario
import type { Usuario } from '../types';

export class PermissionService {
  /**
   * Helper para obtener el rol del usuario (verifica tanto 'rol' como 'tipo')
   */
  private static getUserRole(user: Usuario | null): string | undefined {
    if (!user) return undefined;
    return user.rol || user.tipo;
  }

  /**
   * Verificar si el usuario puede crear/editar/eliminar alumnos
   */
  static canManageStudents(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role ? ['admin', 'tutor'].includes(role) : false;
  }

  /**
   * Verificar si el usuario puede ver entrevistas
   */
  static canViewInterviews(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role ? ['admin', 'tutor'].includes(role) : false;
  }

  /**
   * Verificar si el usuario puede crear/editar entrevistas
   */
  static canManageInterviews(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role ? ['admin', 'tutor'].includes(role) : false;
  }

  /**
   * Verificar si el usuario puede ver alumnos (todos los roles pueden ver)
   */
  static canViewStudents(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role ? ['admin', 'tutor', 'invitado'].includes(role) : false;
  }

  /**
   * Verificar si el usuario puede gestionar otros usuarios (crear tutores/invitados)
   */
  static canManageUsers(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role === 'admin';
  }

  /**
   * Verificar si el usuario es admin
   */
  static isAdmin(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role === 'admin';
  }

  /**
   * Verificar si el usuario es tutor
   */
  static isTutor(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role === 'tutor';
  }

  /**
   * Verificar si el usuario es invitado (solo lectura)
   */
  static isGuest(user: Usuario | null): boolean {
    if (!user) return false;
    const role = this.getUserRole(user);
    return role === 'invitado';
  }

  /**
   * Obtener mensaje de permisos denegados según el contexto
   */
  static getPermissionDeniedMessage(action: string): string {
    const messages: { [key: string]: string } = {
      'manage_students': 'No tienes permisos para agregar o editar alumnos. Solo Admin y Tutores pueden realizar esta acción.',
      'view_interviews': 'No tienes permisos para ver entrevistas. Esta función está disponible solo para Admin y Tutores.',
      'manage_interviews': 'No tienes permisos para crear o editar entrevistas. Solo Admin y Tutores pueden realizar esta acción.',
      'manage_users': 'No tienes permisos para gestionar usuarios. Esta función está disponible solo para Administradores.'
    };
    return messages[action] || 'No tienes permisos para realizar esta acción.';
  }
}

export default PermissionService;