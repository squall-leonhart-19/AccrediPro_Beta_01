
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function keyInfo() {
  const user = await prisma.user.findFirst({
    where: { email: { contains: 'knorsworthy14' } }
  });
  console.log('User found:', user ? JSON.stringify(user, null, 2) : 'None');
}
keyInfo();

