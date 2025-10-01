import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, CreateAdminUserDto, CreateSuperUserDto } from './dto/create-user.dto';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Registrar usuario casual (público)
  async registerUser(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;

    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario casual
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.USER_CASUAL,
        status: UserStatus.PENDING_VERIFICATION,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isEmailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return user;
  }

  // Crear UserAdmin (solo SuperUser)
  async createAdminUser(createAdminDto: CreateAdminUserDto, createdById: number) {
    // Verificar que quien crea es SuperUser
    const creator = await this.prisma.user.findUnique({
      where: { id: createdById },
    });

    if (!creator || creator.role !== UserRole.SUPER_USER) {
      throw new ForbiddenException('Solo los SuperUsers pueden crear UserAdmins');
    }

    const { email, password, firstName, lastName } = createAdminDto;

    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear UserAdmin
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.USER_ADMIN,
        status: UserStatus.ACTIVE, // UserAdmins se crean directamente activos
        isEmailVerified: true, // No necesitan verificar email
        createdById,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return user;
  }

  // Crear SuperUser (solo SuperUser)
  async createSuperUser(createSuperDto: CreateSuperUserDto, createdById: number) {
    // Verificar que quien crea es SuperUser
    const creator = await this.prisma.user.findUnique({
      where: { id: createdById },
    });

    if (!creator || creator.role !== UserRole.SUPER_USER) {
      throw new ForbiddenException('Solo los SuperUsers pueden crear otros SuperUsers');
    }

    const { email, password, firstName, lastName } = createSuperDto;

    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear SuperUser
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.SUPER_USER,
        status: UserStatus.ACTIVE, // SuperUsers se crean directamente activos
        isEmailVerified: true, // No necesitan verificar email
        createdById,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return user;
  }

  // Encontrar usuario por email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Encontrar usuario por ID
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        isEmailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // Actualizar último login
  async updateLastLogin(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  // Activar usuario después de verificación de email
  async activateUser(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      },
    });
  }

  // Listar usuarios (con paginación)
  async findAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isEmailVerified: true,
          lastLogin: true,
          createdAt: true,
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}