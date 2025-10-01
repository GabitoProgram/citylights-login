const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // 1. Eliminar usuario si existe
    await prisma.user.deleteMany({
      where: { email: 'test@citylights.com' }
    });

    // 2. Crear contraseña hasheada
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 3. Crear usuario directamente como ACTIVO y VERIFICADO
    const user = await prisma.user.create({
      data: {
        email: 'test@citylights.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER_CASUAL',
        status: 'ACTIVE',
        emailVerified: true, // ✅ Directamente verificado
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: 123456');
    console.log('👤 Nombre:', user.firstName, user.lastName);
    console.log('🟢 Status:', user.status);
    console.log('✉️ Email Verificado:', user.emailVerified);
    console.log('🆔 ID:', user.id);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();