const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkVerificationCode() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'gabrielcallisayadiaz@gmail.com' },
      include: {
        emailVerifications: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('👤 Usuario:', user.email);
    console.log('📧 Status:', user.status);
    
    if (user.emailVerifications.length > 0) {
      const verification = user.emailVerifications[0];
      console.log('🔑 Código actual:', verification.code);
      console.log('⏰ Expira:', verification.expiresAt);
      console.log('🕒 Ahora:', new Date());
      console.log('✅ Válido:', verification.expiresAt > new Date());
    } else {
      console.log('❌ No hay códigos de verificación');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVerificationCode();