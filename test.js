const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient({ log: ['info'] });
  console.log("Success with log");
} catch(e) {
  console.log("Error logic 1", e.message);
}
try {
  const prisma = new PrismaClient({ log: ['info'], datasourceUrl: "file:./dev.db" });
  console.log("Success with datasourceUrl");
} catch(e) {
  console.log("Error logic 2", e.message);
}
