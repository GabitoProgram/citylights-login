import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  Param, 
  Res,
  NotFoundException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { multerOptions } from './multer.config';
import * as path from 'path';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async uploadAvatar(@UploadedFile() file: any, @Request() req) {
    const userId = req.user.sub;
    const avatarUrl = await this.uploadService.uploadAvatar(userId, file);
    
    return {
      success: true,
      message: 'Avatar subido exitosamente',
      data: {
        avatarUrl,
        userId
      }
    };
  }

  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  async removeAvatar(@Request() req) {
    const userId = req.user.sub;
    await this.uploadService.removeAvatar(userId);
    
    return {
      success: true,
      message: 'Avatar eliminado exitosamente'
    };
  }

  @Get('avatar/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Avatar no encontrado');
    }
    
    res.sendFile(filePath);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getUploadStats() {
    const stats = await this.uploadService.getUploadStats();
    
    return {
      success: true,
      data: stats
    };
  }
}