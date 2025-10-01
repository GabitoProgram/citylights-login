import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  BadRequestException,
  NotFoundException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { LogService } from '../logs/logs.service';
import { RegisterDto, LoginDto, VerifyEmailDto, RefreshTokenDto } from './dto/auth.dto';
import { UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private usersService: UsersService,
    private logService: LogService,
  ) {}

  // Registro de usuario (solo USER_CASUAL)
  async register(registerDto: RegisterDto) {
    // Crear el usuario usando UsersService
    const user = await this.usersService.registerUser(registerDto);

    // Generar código de verificación
    const verificationCode = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar código de verificación
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt,
      },
    });

    // Enviar email de verificación
    await this.emailService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationCode
    );

    return {
      message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.',
      userId: user.id,
      email: user.email,
    };
  }

  // Login
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password } = loginDto;

    try {
      // Buscar usuario
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        // Log failed login attempt
        if (user) {
          await this.logService.logLogin({
            userId: user.id,
            userType: user.role,
            userName: `${user.firstName} ${user.lastName}`,
            ipAddress,
            userAgent,
            loginMethod: 'email',
            success: false,
            errorMessage: 'Credenciales inválidas'
          });
        }
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Log failed password attempt
        await this.logService.logLogin({
          userId: user.id,
          userType: user.role,
          userName: `${user.firstName} ${user.lastName}`,
          ipAddress,
          userAgent,
          loginMethod: 'email',
          success: false,
          errorMessage: 'Contraseña incorrecta'
        });
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar que el usuario esté activo y verificado
      if (user.status !== UserStatus.ACTIVE || !user.isEmailVerified) {
        // Log failed login due to inactive account
        await this.logService.logLogin({
          userId: user.id,
          userType: user.role,
          userName: `${user.firstName} ${user.lastName}`,
          ipAddress,
          userAgent,
          loginMethod: 'email',
          success: false,
          errorMessage: 'Cuenta no verificada o inactiva'
        });
        throw new UnauthorizedException('Cuenta no verificada o inactiva');
      }

      // Actualizar último login
      await this.usersService.updateLastLogin(user.id);

      // Generar tokens
      const tokens = await this.generateTokens(user);

      // Log successful login
      await this.logService.logLogin({
        userId: user.id,
        userType: user.role,
        userName: `${user.firstName} ${user.lastName}`,
        ipAddress,
        userAgent,
        loginMethod: 'email',
        success: true
      });

      return {
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        ...tokens,
      };
    } catch (error) {
      // Si es un error controlado (UnauthorizedException), lo re-lanzamos
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Para otros errores, los loggeamos y lanzamos error genérico
      console.error('❌ Error en login:', error);
      throw new UnauthorizedException('Error interno en el login');
    }
  }

  // Verificar email
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    // Buscar usuario
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar código de verificación válido
    const verification = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      throw new BadRequestException('Código de verificación inválido o expirado');
    }

    // Marcar código como usado
    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: { isUsed: true },
    });

    // Activar usuario
    await this.usersService.activateUser(user.id);

    // Enviar email de bienvenida
    await this.emailService.sendWelcomeEmail(
      user.email,
      user.firstName,
      user.role
    );

    return {
      message: 'Email verificado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: UserStatus.ACTIVE,
      },
    };
  }

  // Refresh token
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verificar refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Buscar en la base de datos
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.isRevoked || new Date() > storedToken.expiresAt) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Generar nuevos tokens
      const tokens = await this.generateTokens(storedToken.user);

      // Revocar el refresh token usado
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });

      return {
        message: 'Token renovado exitosamente',
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  // Generar tokens JWT
  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    // Guardar refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  // Solicitar reset de contraseña
  async forgotPassword(email: string) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return {
        message: 'Si el email existe en nuestro sistema, recibirás un código de verificación.',
      };
    }

    // Verificar que el usuario esté activo
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('Tu cuenta no está activa. Contacta al administrador.');
    }

    // Invalidar códigos previos
    await this.prisma.emailVerification.updateMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // Generar nuevo código de verificación
    const verificationCode = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar código de verificación
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code: verificationCode,
        expiresAt,
      },
    });

    // Enviar email con código de reset
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      verificationCode,
    );

    return {
      message: 'Se ha enviado un código de verificación a tu email.',
    };
  }

  // Restablecer contraseña
  async resetPassword(email: string, code: string, newPassword: string) {
    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    // Verificar el código
    const verification = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      throw new BadRequestException('Código inválido o expirado.');
    }

    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña del usuario
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Marcar código como usado
    await this.prisma.emailVerification.update({
      where: { id: verification.id },
      data: { isUsed: true },
    });

    // Invalidar todos los refresh tokens existentes por seguridad
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    return {
      message: 'Contraseña restablecida exitosamente.',
    };
  }

  // Generar código de verificación
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}