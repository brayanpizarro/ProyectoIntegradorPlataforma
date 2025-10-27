import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { AuthResponseDto, TokensResponseDto, LogoutResponseDto } from './dto/auth-response.dto';
import { TokenService } from './services/token.service';
import { AUTH_MESSAGES } from './constants/auth.constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}


  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {

    const existingUsername = await this.usersRepository.findOne({
      where: { username: registerDto.username },
    });
    if (existingUsername) {
      throw new ConflictException(AUTH_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const existingEmail = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingEmail) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.usersRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      rol: registerDto.rol || UserRole.VISITA,
      activo: true,
    });

    const savedUser = await this.usersRepository.save(newUser);

    await this.updateLastLogin(savedUser.id);

    const tokens = await this.tokenService.generateTokens(savedUser);

    return {
      ...tokens,
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        nombre: savedUser.nombre,
        apellido: savedUser.apellido,
        rol: savedUser.rol,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateCredentials(loginDto);
    await this.updateLastLogin(user.id);
    const tokens = await this.tokenService.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<TokensResponseDto> {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const storedToken = this.tokenService.getStoredRefreshToken(refreshToken);

      this.validateStoredToken(storedToken, payload);

      const user = await this.findActiveUser(payload.sub);

      this.tokenService.invalidateRefreshToken(refreshToken);

      return this.tokenService.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(AUTH_MESSAGES.EXPIRED_REFRESH_TOKEN);
    }
  }

  async logout(refreshToken: string): Promise<LogoutResponseDto> {
    this.tokenService.invalidateRefreshToken(refreshToken);
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  cleanExpiredTokens(): void {
    this.tokenService.cleanExpiredTokens();
  }

  // Private helper methods
  private async validateCredentials(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.activo) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_INACTIVE);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  }

  private async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.update(userId, {
      ultimo_login: new Date(),
    });
  }

  private async findActiveUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, activo: true },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  private validateStoredToken(
    storedToken: { userId: number; tokenId: string } | undefined,
    payload: { sub: number; tokenId: string },
  ): void {
    if (
      !storedToken ||
      storedToken.userId !== payload.sub ||
      storedToken.tokenId !== payload.tokenId
    ) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }
}
