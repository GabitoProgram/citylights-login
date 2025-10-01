import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  // Validar archivo de imagen
  validateImage(file: any): void {
    // Verificar que sea un archivo
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Verificar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo es demasiado grande. Máximo 5MB.');
    }

    // Verificar tipo de archivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten archivos JPG, PNG y GIF');
    }
  }

  // Procesar y guardar avatar
  async uploadAvatar(userId: number, file: any): Promise<string> {
    this.validateImage(file);

    try {
      // Generar nombre único
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = `avatar-${userId}-${timestamp}${extension}`;
      const filepath = path.join('uploads', 'avatars', filename);
      const fullPath = path.join(process.cwd(), filepath);

      // Procesar imagen con Sharp (redimensionar y optimizar)
      await sharp(file.buffer)
        .resize(300, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toFile(fullPath);

      // Obtener usuario actual para eliminar avatar anterior
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true }
      });

      // Eliminar avatar anterior si existe
      if (user?.avatarUrl) {
        await this.deleteAvatarFile(user.avatarUrl);
      }

      // Actualizar usuario con nueva URL
      const avatarUrl = `/uploads/avatars/${filename}`;
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl }
      });

      console.log(`📸 Avatar actualizado para usuario ${userId}: ${avatarUrl}`);
      return avatarUrl;

    } catch (error) {
      console.error('❌ Error procesando avatar:', error);
      throw new BadRequestException('Error procesando la imagen');
    }
  }

  // Eliminar avatar del usuario
  async removeAvatar(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    if (!user?.avatarUrl) {
      throw new BadRequestException('El usuario no tiene avatar para eliminar');
    }

    // Eliminar archivo físico
    await this.deleteAvatarFile(user.avatarUrl);

    // Actualizar base de datos
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null }
    });

    console.log(`🗑️ Avatar eliminado para usuario ${userId}`);
  }

  // Eliminar archivo físico del sistema
  private async deleteAvatarFile(avatarUrl: string): Promise<void> {
    try {
      const filename = path.basename(avatarUrl);
      const fullPath = path.join(process.cwd(), 'uploads', 'avatars', filename);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Archivo eliminado: ${filename}`);
      }
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
      // No lanzamos error para no interrumpir el flujo
    }
  }

  // Obtener estadísticas de archivos
  async getUploadStats(): Promise<any> {
    const usersWithAvatar = await this.prisma.user.count({
      where: {
        avatarUrl: { not: null }
      }
    });

    const totalUsers = await this.prisma.user.count();

    return {
      usersWithAvatar,
      totalUsers,
      percentageWithAvatar: totalUsers > 0 ? Math.round((usersWithAvatar / totalUsers) * 100) : 0
    };
  }
}