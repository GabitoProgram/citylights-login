import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

export interface LoginLogData {
  userId: number;
  userType: UserRole;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  loginMethod: 'email' | 'refresh_token';
  success: boolean;
  errorMessage?: string;
}

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  // Registrar un log de login
  async logLogin(data: LoginLogData) {
    try {
      const loginLog = await this.prisma.loginLog.create({
        data: {
          userId: data.userId,
          userType: data.userType,
          userName: data.userName,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          loginMethod: data.loginMethod,
          success: data.success,
          errorMessage: data.errorMessage,
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      });

      console.log(`📊 Login log registrado: ${data.userName} (${data.loginMethod}) - ${data.success ? 'SUCCESS' : 'FAILED'}`);
      
      return loginLog;
    } catch (error) {
      console.error('❌ Error al registrar login log:', error);
      // No lanzamos error para no afectar el flujo de login
    }
  }

  // Obtener logs de login con filtros
  async getLoginLogs(params: {
    userId?: string;
    userType?: UserRole;
    loginMethod?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const {
      userId,
      userType,
      loginMethod,
      success,
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = params;

    const where: any = {};

    if (userId) where.userId = userId;
    if (userType) where.userType = userType;
    if (loginMethod) where.loginMethod = loginMethod;
    if (success !== undefined) where.success = success;
    
    if (startDate || endDate) {
      where.loginTime = {};
      if (startDate) where.loginTime.gte = startDate;
      if (endDate) where.loginTime.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.loginLog.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            }
          }
        },
        orderBy: {
          loginTime: 'desc'
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.loginLog.count({ where })
    ]);

    return {
      logs,
      pagination: {
        total,
        limit,
        offset,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Estadísticas de login
  async getLoginStats(params: {
    startDate?: Date;
    endDate?: Date;
  }) {
    const { startDate, endDate } = params;
    
    const where: any = {};
    if (startDate || endDate) {
      where.loginTime = {};
      if (startDate) where.loginTime.gte = startDate;
      if (endDate) where.loginTime.lte = endDate;
    }

    const [
      totalLogins,
      successfulLogins,
      failedLogins,
      uniqueUsers,
      loginsByRole,
      loginsByMethod
    ] = await Promise.all([
      // Total de logins
      this.prisma.loginLog.count({ where }),
      
      // Logins exitosos
      this.prisma.loginLog.count({ 
        where: { ...where, success: true } 
      }),
      
      // Logins fallidos
      this.prisma.loginLog.count({ 
        where: { ...where, success: false } 
      }),
      
      // Usuarios únicos que hicieron login
      this.prisma.loginLog.findMany({
        where,
        select: { userId: true },
        distinct: ['userId']
      }),
      
      // Logins por rol
      this.prisma.loginLog.groupBy({
        by: ['userType'],
        where,
        _count: { userType: true }
      }),
      
      // Logins por método
      this.prisma.loginLog.groupBy({
        by: ['loginMethod'],
        where,
        _count: { loginMethod: true }
      })
    ]);

    return {
      overview: {
        totalLogins,
        successfulLogins,
        failedLogins,
        successRate: totalLogins > 0 ? (successfulLogins / totalLogins * 100).toFixed(2) : 0,
        uniqueUsers: uniqueUsers.length
      },
      byRole: loginsByRole.map(item => ({
        role: item.userType,
        count: item._count.userType
      })),
      byMethod: loginsByMethod.map(item => ({
        method: item.loginMethod,
        count: item._count.loginMethod
      }))
    };
  }

  // Últimos logins de un usuario específico
  async getUserRecentLogins(userId: number, limit: number = 10) {
    return this.prisma.loginLog.findMany({
      where: { userId },
      orderBy: { loginTime: 'desc' },
      take: limit,
      select: {
        id: true,
        loginTime: true,
        ipAddress: true,
        userAgent: true,
        loginMethod: true,
        success: true,
        errorMessage: true
      }
    });
  }
}