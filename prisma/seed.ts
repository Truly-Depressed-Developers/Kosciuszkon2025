import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = async () => {
  const producers = [
    { name: 'Energa', link: 'https://www.energa.pl/kampanie/dom/fotowoltaika/kampania-eko' },
    { name: 'House Solutions', link: 'https://house-solutions.pl/poradnik/' },
    { name: 'Otovo', link: 'https://www.otovo.pl/a/instalacje-fotowoltaiczne/' },
    { name: 'SunSol', link: 'https://sunsol.pl/instalacje-pv/montaz/' },
    { name: 'BiSolar', link: 'https://bisolar.pl' },
  ];

  for (const producer of producers) {
    await prisma.producents.create({
      data: producer,
    });
  }
};

/**
 * Main seed function to populate the database
 */
async function main(): Promise<void> {
  try {
    await clearDatabase();
    await seedData();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
async function clearDatabase(): Promise<void> {
  const tableNames = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public' and tablename NOT LIKE '_prisma_migrations'`;

  for (const { tablename } of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" RESTART IDENTITY CASCADE;`);
    } catch (error) {
      console.error(`Error truncating table ${tablename}:`, error);
    }
  }
}

// Run the seed function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
