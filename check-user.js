const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'mamagabriel832@gmail.com'
      }
    });
    
    console.log('📋 Usuario encontrado:');
    console.log('- Email:', user?.email);
    console.log('- Status:', user?.status);
    console.log('- ID:', user?.id);
    console.log('- FirstName:', user?.firstName);
    console.log('- LastName:', user?.lastName);
    console.log('- Role:', user?.role);
    console.log('- CreatedAt:', user?.createdAt);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();