export interface JwtPayload {
  sub: number;
  username: string;
  email: string;
  rol: string;
}

export interface JwtRefreshPayload extends JwtPayload {
  tokenId: string;
}

export interface StoredRefreshToken {
  userId: number;
  tokenId: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  rol: string;
  nombre: string;
  apellido: string;
}
