export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;
}

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export class TokensResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class ValidateTokenResponseDto {
  valid: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    rol: string;
  };
}

export class LogoutResponseDto {
  message: string;
}
