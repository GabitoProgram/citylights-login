const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLatestUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        isEmailVerified: true,
        createdAt: true
      }
    });
    
    console.log('📋 Últimos usuarios registrados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Email Verificado: ${user.isEmailVerified}`);
      console.log(`   Creado: ${user.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestUsers();