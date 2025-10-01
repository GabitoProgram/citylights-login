import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, callback) => {
    // Verificar tipo de archivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Solo se permiten archivos JPG, PNG y GIF'),
        false
      );
    }
    
    callback(null, true);
  },
  storage: undefined, // Usamos memoria para procesar con Sharp
};