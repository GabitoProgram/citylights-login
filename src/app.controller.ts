import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      service: 'CITYLIGHTS Auth Service',
      port: 3001,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}