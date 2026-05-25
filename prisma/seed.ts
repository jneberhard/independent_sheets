import "dotenv/config";
import { PrismaClient, CategoryGroup, RoleName } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  console.log("Seeding roles...");

  await prisma.role.upsert({
    where: {
      name: RoleName.USER,
    },
    update: {},
    create: {
      name: RoleName.USER,
    },
  });

  await prisma.role.upsert({
    where: {
      name: RoleName.PUBLISHER,
    },
    update: {},
    create: {
      name: RoleName.PUBLISHER,
    },
  });

  await prisma.role.upsert({
    where: {
      name: RoleName.ADMIN,
    },
    update: {},
    create: {
      name: RoleName.ADMIN,
    },
  });

  console.log("Seeding categories...");

  const categories = [
    { name: "SATB", slug: "satb", group: CategoryGroup.VOICING },
    { name: "SAB", slug: "sab", group: CategoryGroup.VOICING },
    { name: "TTBB", slug: "ttbb", group: CategoryGroup.VOICING },
    { name: "SSA", slug: "ssa", group: CategoryGroup.VOICING },
    { name: "Piano", slug: "piano", group: CategoryGroup.INSTRUMENT },
    { name: "Organ", slug: "organ", group: CategoryGroup.INSTRUMENT },
    { name: "Guitar", slug: "guitar", group: CategoryGroup.INSTRUMENT },
    { name: "Flute", slug: "flute", group: CategoryGroup.INSTRUMENT },
    { name: "Sacred", slug: "sacred", group: CategoryGroup.GENRE },
    { name: "Classical", slug: "classical", group: CategoryGroup.GENRE },
    { name: "Gospel", slug: "gospel", group: CategoryGroup.GENRE },
    { name: "Holiday", slug: "holiday", group: CategoryGroup.GENRE },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        group: category.group,
      },
      create: category,
    });
  }

  console.log("Roles seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
