const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const msgs = await prisma.salesChat.findMany({ 
    where: { page: { contains: 'scholarship' } }, 
    orderBy: { createdAt: 'desc' }, 
    take: 20 
  });
  
  console.log("Count:", msgs.length);
  msgs.forEach(m => { 
    console.log(m.isFromVisitor ? "VISITOR" : "SARAH", m.visitorEmail || m.visitorId, m.message.substring(0, 50).replace(/\n/g, " ")); 
  });
  
  await prisma.$disconnect();
}
check();
