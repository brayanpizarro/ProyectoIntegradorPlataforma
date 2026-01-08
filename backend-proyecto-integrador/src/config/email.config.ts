import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER || 'noreply.ucnproyect@gmail.com', // COLOCA TU EMAIL AQUÍ
    pass: process.env.EMAIL_PASSWORD || 'vhtr adrc iise llxs', // COLOCA TU APP PASSWORD DE GMAIL AQUÍ
  },
  from: process.env.EMAIL_FROM || '"Sistema de Becarios" <noreply@becarios.cl>',
  resetCodeExpiration: parseInt(process.env.RESET_CODE_EXPIRATION || '15', 10),
}));
