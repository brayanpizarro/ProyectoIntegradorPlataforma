import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from './services/token.service';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.access.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.access.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, TokenService, JwtStrategy, PassportModule],
})
export class AuthModule {}
