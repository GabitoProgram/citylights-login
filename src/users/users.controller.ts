import { Controller, Post, Body, Get, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminUserDto, CreateSuperUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_USER)
  async createAdminUser(@Body() createAdminDto: CreateAdminUserDto, @Request() req) {
    const createdById = req.user.sub;
    const user = await this.usersService.createAdminUser(createAdminDto, createdById);
    
    return {
      success: true,
      message: 'UserAdmin creado exitosamente',
      data: user,
    };
  }

  @Post('create-super')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_USER)
  async createSuperUser(@Body() createSuperDto: CreateSuperUserDto, @Request() req) {
    const createdById = req.user.sub;
    const user = await this.usersService.createSuperUser(createSuperDto, createdById);
    
    return {
      success: true,
      message: 'SuperUser creado exitosamente',
      data: user,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    
    return {
      success: true,
      data: user,
    };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_USER, UserRole.USER_ADMIN)
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    const result = await this.usersService.findAllUsers(pageNum, limitNum);
    
    return {
      success: true,
      data: result,
    };
  }
}