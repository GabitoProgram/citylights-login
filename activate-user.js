const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function activateUser() {
  try {
    const user = await prisma.user.update({
      where: {
        email: 'test.gateway@citylights.com'
      },
      data: {
        status: 'ACTIVE',
        isEmailVerified: true
      }
    });
    
    console.log('✅ Usuario activado:', user.email);
    console.log('Status:', user.status);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

activateUser();