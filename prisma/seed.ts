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

  console.log("Seeding demo publisher and sheet music...");

  const publisherRole = await prisma.role.findUnique({
    where: { name: RoleName.PUBLISHER },
  });

  if (!publisherRole) {
    throw new Error("PUBLISHER role not found during seed.");
  }

  const demoUser = await prisma.user.upsert({
    where: { email: "demo.publisher@independentsheets.com" },
    update: {
      name: "Demo Publisher",
      roleId: publisherRole.id,
    },
    create: {
      email: "demo.publisher@independentsheets.com",
      name: "Demo Publisher",
      roleId: publisherRole.id,
    },
  });

  const [satb, sab, piano, organ, sacred, classical] = await Promise.all([
    prisma.category.findUnique({ where: { slug: "satb" } }),
    prisma.category.findUnique({ where: { slug: "sab" } }),
    prisma.category.findUnique({ where: { slug: "piano" } }),
    prisma.category.findUnique({ where: { slug: "organ" } }),
    prisma.category.findUnique({ where: { slug: "sacred" } }),
    prisma.category.findUnique({ where: { slug: "classical" } }),
  ]);

  const requiredCategories = [satb, sab, piano, organ, sacred, classical];
  if (requiredCategories.some((item) => !item)) {
    throw new Error("One or more demo categories were not found.");
  }

  const demoSongs = [
    {
      title: "Amazing Grace (SATB)",
      slug: "amazing-grace-satb",
      description: "Demo sheet music for detail page testing.",
      priceCents: 499,
      pdfUrl: "https://example.com/demo/amazing-grace-satb.pdf",
      imageUrl: "https://example.com/demo/amazing-grace-satb.jpg",
      previewMp3Url: "https://example.com/demo/amazing-grace-satb.mp3",
      previewLink: "https://www.youtube.com/watch?v=CDdvReNKKuk",
      categoryIds: [satb!.id, piano!.id, sacred!.id],
    },
    {
      title: "How Great Thou Art (SAB)",
      slug: "how-great-thou-art-sab",
      description: "Demo SAB arrangement with organ accompaniment.",
      priceCents: 599,
      pdfUrl: "https://example.com/demo/how-great-thou-art-sab.pdf",
      imageUrl: "https://example.com/demo/how-great-thou-art-sab.jpg",
      previewMp3Url: null,
      previewLink: "https://open.spotify.com/",
      categoryIds: [sab!.id, organ!.id, sacred!.id],
    },
    {
      title: "Ave Verum Corpus (SATB)",
      slug: "ave-verum-corpus-satb",
      description: "Demo classical choir listing for navigation checks.",
      priceCents: 699,
      pdfUrl: "https://example.com/demo/ave-verum-corpus-satb.pdf",
      imageUrl: "https://example.com/demo/ave-verum-corpus-satb.jpg",
      previewMp3Url: "https://example.com/demo/ave-verum-corpus-satb.mp3",
      previewLink: null,
      categoryIds: [satb!.id, piano!.id, classical!.id],
    },
  ];

  for (const song of demoSongs) {
    const savedSong = await prisma.sheetMusic.upsert({
      where: { pdfUrl: song.pdfUrl },
      update: {
        title: song.title,
        description: song.description,
        priceCents: song.priceCents,
        imageUrl: song.imageUrl,
        previewMp3Url: song.previewMp3Url,
        previewLink: song.previewLink,
        artistId: demoUser.id,
      },
      create: {
        title: song.title,
        description: song.description,
        priceCents: song.priceCents,
        pdfUrl: song.pdfUrl,
        imageUrl: song.imageUrl,
        previewMp3Url: song.previewMp3Url,
        previewLink: song.previewLink,
        artistId: demoUser.id,
      },
    });

    await prisma.sheetMusicCategory.createMany({
      data: song.categoryIds.map((categoryId) => ({
        sheetMusicId: savedSong.id,
        categoryId,
      })),
      skipDuplicates: true,
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
