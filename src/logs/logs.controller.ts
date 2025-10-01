import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { LogService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly logService: LogService) {}

  // Obtener logs de login (solo admin y super users)
  @Get('login')
  @Roles(UserRole.USER_ADMIN, UserRole.SUPER_USER)
  async getLoginLogs(
    @Query('userId') userId?: string,
    @Query('userType') userType?: UserRole,
    @Query('loginMethod') loginMethod?: string,
    @Query('success') success?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const params = {
      userId,
      userType,
      loginMethod,
      success: success ? success === 'true' : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };

    return this.logService.getLoginLogs(params);
  }

  // Estadísticas de login (solo admin y super users)
  @Get('stats')
  @Roles(UserRole.USER_ADMIN, UserRole.SUPER_USER)
  async getLoginStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const params = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.logService.getLoginStats(params);
  }

  // Logs recientes de un usuario específico (solo admin y super users)
  @Get('user/:userId/recent')
  @Roles(UserRole.USER_ADMIN, UserRole.SUPER_USER)
  async getUserRecentLogins(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    const userIdNum = parseInt(userId);
    return this.logService.getUserRecentLogins(userIdNum, limitNum);
  }
}