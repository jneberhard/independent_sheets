import { PrismaClient, CategoryGroup, RoleName } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from your environment variables.");
}

const client = new Client(connectionString);
const adapter = new PrismaNeon(client);
const prisma = new PrismaClient({ adapter });

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

async function main() {
  // Seed the roles first because the rest of the demo data depends on them.
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
    // Voicing categories help the catalog page group choir music in a way
    // that matches how singers actually search for pieces.
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.VOICING,
          slug: slugify(category),
        },
      },
      update: {},
      create: {
        name: category,
        slug: slugify(category),
        group: CategoryGroup.VOICING,
      },
    });
  }

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
    // Instrument categories let us support accompaniment and ensemble-specific browsing.
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.INSTRUMENT,
          slug: slugify(category),
        },
      },
      update: {},
      create: {
        name: category,
        slug: slugify(category),
        group: CategoryGroup.INSTRUMENT,
      },
    });
  }

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
    // Genre categories are useful for broad navigation and for quick demo filtering.
    await prisma.category.upsert({
      where: {
        group_slug: {
          group: CategoryGroup.GENRE,
          slug: slugify(category),
        },
      },
      update: {},
      create: {
        name: category,
        slug: slugify(category),
        group: CategoryGroup.GENRE,
      },
    });
  }

  const publisherRole = await prisma.role.findUnique({
    where: {
      name: RoleName.PUBLISHER,
    },
  });

  if (!publisherRole) {
    throw new Error("PUBLISHER role was not found.");
  }

  const demoPublisher = await prisma.user.upsert({
    where: {
      email: "demo.publisher@independentsheets.com",
    },
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

  const customerRole = await prisma.role.findUnique({
    where: {
      name: RoleName.USER,
    },
  });

  if (!customerRole) {
    throw new Error("USER role was not found.");
  }

  const demoCustomer = await prisma.user.upsert({
    where: {
      email: "demo.customer@independentsheets.com",
    },
    update: {
      name: "Demo Customer",
      roleId: customerRole.id,
    },
    create: {
      email: "demo.customer@independentsheets.com",
      name: "Demo Customer",
      roleId: customerRole.id,
    },
  });

  const demoSongs = [
    {
      title: "Amazing Grace (SATB)",
      description: "Demo sheet music for detail page testing.",
      priceCents: 499,
      pdfUrl: "/songwriter.pdf",
      imageUrl: "/songwriter.png",
      previewMp3Url: null,
      previewLink: "https://www.youtube.com/watch?v=CDdvReNKKuk",
      categorySlugs: ["satb", "piano", "sacred"],
    },
    {
      title: "How Great Thou Art (SAB)",
      description: "Demo SAB arrangement with organ accompaniment.",
      priceCents: 599,
      pdfUrl: "/songwriter.pdf",
      imageUrl: "/hero.png",
      previewMp3Url: null,
      previewLink: "https://open.spotify.com/",
      categorySlugs: ["sab", "organ", "sacred"],
    },
    {
      title: "Ave Verum Corpus (SATB)",
      description: "Demo classical choir listing for navigation checks.",
      priceCents: 699,
      pdfUrl: "/songwriter.pdf",
      imageUrl: "/logo_1.png",
      previewMp3Url: null,
      previewLink: null,
      categorySlugs: ["satb", "piano", "classical"],
    },
  ];

  for (const song of demoSongs) {
    // These demo songs give Benjamin real-looking records for detail-page and catalog testing.
    const existingSong = await prisma.sheetMusic.findFirst({
      where: {
        artistId: demoPublisher.id,
        title: song.title,
      },
    });

    const savedSong = existingSong
      ? await prisma.sheetMusic.update({
          where: {
            id: existingSong.id,
          },
          data: {
            description: song.description,
            priceCents: song.priceCents,
            pdfUrl: song.pdfUrl,
            imageUrl: song.imageUrl,
            previewMp3Url: song.previewMp3Url,
            previewLink: song.previewLink,
          },
        })
      : await prisma.sheetMusic.create({
          data: {
            title: song.title,
            description: song.description,
            priceCents: song.priceCents,
            pdfUrl: song.pdfUrl,
            imageUrl: song.imageUrl,
            previewMp3Url: song.previewMp3Url,
            previewLink: song.previewLink,
            rightsVerified: true,
            artistId: demoPublisher.id,
          },
        });

    const linkedCategories = await prisma.category.findMany({
      where: {
        slug: {
          in: song.categorySlugs,
        },
      },
    });

    await prisma.sheetMusicCategory.createMany({
      data: linkedCategories.map((category) => ({
        sheetMusicId: savedSong.id,
        categoryId: category.id,
      })),
      skipDuplicates: true,
    });
  }

  const demoPurchaseSheetMusic = await prisma.sheetMusic.findFirst({
    where: {
      artistId: demoPublisher.id,
      title: "Amazing Grace (SATB)",
    },
  });

  if (demoPurchaseSheetMusic) {
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        buyerId: demoCustomer.id,
        sheetMusicId: demoPurchaseSheetMusic.id,
      },
    });

    if (!existingPurchase) {
      // The sample purchase proves the royalty split and download flow both have real data to read.
      const artistAmount = Math.round(demoPurchaseSheetMusic.priceCents * 0.75);
      const platformAmount = demoPurchaseSheetMusic.priceCents - artistAmount;

      const purchase = await prisma.purchase.create({
        data: {
          buyerId: demoCustomer.id,
          sheetMusicId: demoPurchaseSheetMusic.id,
          amountCents: demoPurchaseSheetMusic.priceCents,
        },
      });

      await prisma.royalty.create({
        data: {
          purchaseId: purchase.id,
          artistAmount,
          platformAmount,
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
