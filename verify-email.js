const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyUserEmail() {
  try {
    // 1. Encontrar el usuario
    const user = await prisma.user.findUnique({
      where: { email: 'mamagabriel832@gmail.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    // 2. Marcar email como verificado
    await prisma.user.update({
      where: { email: 'mamagabriel832@gmail.com' },
      data: {
        emailVerified: true,
        status: 'ACTIVE'
      }
    });

    // 3. Eliminar registros de verificación pendientes
    await prisma.emailVerification.deleteMany({
      where: { userId: user.id }
    });

    console.log('✅ Email verificado y usuario activado');
    console.log('📧 Email:', user.email);
    console.log('👤 Usuario:', user.firstName, user.lastName);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUserEmail();