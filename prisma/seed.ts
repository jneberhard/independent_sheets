import { PrismaClient, CategoryGroup, RoleName } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";

// 1. Configure serverless driver to use WebSockets in Node.js
neonConfig.webSocketConstructor = ws;

// 2. Validate and extract database connection string
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing from your environment variables.");
}

// 3. Initialize Neon Client and Prisma Adapter
const client = new Client(connectionString);
const adapter = new PrismaNeon(client);
const prisma = new PrismaClient({ adapter });

async function main() {
  /*
    Roles
  */

  await prisma.role.upsert({
    where: {
      name: RoleName.USER,
    },
    update: {},
    create: {
      id: "role_user",
      name: RoleName.USER,
    },
  });

  await prisma.role.upsert({
    where: {
      name: RoleName.PUBLISHER,
    },
    update: {},
    create: {
      id: "role_publisher",
      name: RoleName.PUBLISHER,
    },
  });

  await prisma.role.upsert({
    where: {
      name: RoleName.ADMIN,
    },
    update: {},
    create: {
      id: "role_admin",
      name: RoleName.ADMIN,
    },
  });

  /*
    Voicing Categories -
  */

  const voicings = [
    "SATB",
    "SSAA",
    "TTBB",
    "SSA",
    "SAB",
    "Two-Part",
    "Unison",
    "Choir",
    "Acapella",
    "SATB/Piano",
    "SSAA/Piano",
    "TTBB/Piano",
  ];

  for (const category of voicings) {
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.VOICING,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
        },
      },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        group: CategoryGroup.VOICING,
      },
    });
  }

  /*
    Instrument Categories -- add more if needed
  */

  const instruments = [
    "Piano",
    "Violin",
    "Flute",
    "Clarinet",
    "Trumpet",
    "Trombone",
    "Cello",
    "Guitar",
    "Organ",
    "Harp",
    "Drums",
    "Bass Guitar",
    "Guitar Tabs",
  ];

  for (const category of instruments) {
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.INSTRUMENT,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
        },
      },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        group: CategoryGroup.INSTRUMENT,
      },
    });
  }

  /*
    Genre Categories
  */

  const genres = [
    "Sacred",
    "Classical",
    "Broadway",
    "Jazz",
    "Christmas",
    "Patriotic",
    "Wedding",
    "Contemporary",
  ];

  for (const category of genres) {
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.GENRE,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
        },
      },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        group: CategoryGroup.GENRE,
      },
    });
  }

  console.log("🌱 Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
