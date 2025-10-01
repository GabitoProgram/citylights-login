import { Module } from '@nestjs/common';
import { LogService } from './logs.service';
import { LogsController } from './logs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogsController],
  providers: [LogService],
  exports: [LogService], // Exportar para usar en AuthService
})
export class LogsModule {}