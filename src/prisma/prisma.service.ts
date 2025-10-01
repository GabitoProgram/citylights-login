import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('🗄️  Conectado a la base de datos PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🗄️  Desconectado de la base de datos PostgreSQL');
  }

  // Método helper para limpiar la base de datos en testing
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('No se puede limpiar la base de datos en producción');
    }

    const modelNames = Object.keys(this).filter(key => !key.startsWith('_') && !key.startsWith('$'));
    
    return Promise.all(
      modelNames.map(modelName => {
        const model = (this as any)[modelName];
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      })
    );
  }
}