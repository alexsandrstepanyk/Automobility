import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
    url: 'file:./dev.db',
})
const adapter = new PrismaLibSql(libsql as any)
const prisma = new PrismaClient({ adapter })

async function main() {
  const count = await (prisma as any).carCatalog.count();
  console.log(`\n🚗 Car Catalog Stats:`);
  console.log(`Total entries: ${count}`);

  if (count > 0) {
    const brands = await (prisma as any).carCatalog.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
      take: 10
    });
    console.log(`Sample Brands: ${brands.map((b: any) => b.brand).join(', ')}...`);

    const samples = await (prisma as any).carCatalog.findMany({
      take: 10
    });
    console.log(`Sample Models:`);
    samples.forEach((s: any) => console.log(`- ${s.brand} ${s.model}`));
  } else {
    console.log(`⚠️ Car Catalog is empty!`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
