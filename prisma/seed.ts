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
      pdfUrl: "https://example.com/demo/amazing-grace-satb.pdf",
      imageUrl: "https://example.com/demo/amazing-grace-satb.jpg",
      previewMp3Url: "https://example.com/demo/amazing-grace-satb.mp3",
      previewLink: "https://www.youtube.com/watch?v=CDdvReNKKuk",
      categorySlugs: ["satb", "piano", "sacred"],
    },
    {
      title: "How Great Thou Art (SAB)",
      description: "Demo SAB arrangement with organ accompaniment.",
      priceCents: 599,
      pdfUrl: "https://example.com/demo/how-great-thou-art-sab.pdf",
      imageUrl: "https://example.com/demo/how-great-thou-art-sab.jpg",
      previewMp3Url: null,
      previewLink: "https://open.spotify.com/",
      categorySlugs: ["sab", "organ", "sacred"],
    },
    {
      title: "Ave Verum Corpus (SATB)",
      description: "Demo classical choir listing for navigation checks.",
      priceCents: 699,
      pdfUrl: "https://example.com/demo/ave-verum-corpus-satb.pdf",
      imageUrl: "https://example.com/demo/ave-verum-corpus-satb.jpg",
      previewMp3Url: "https://example.com/demo/ave-verum-corpus-satb.mp3",
      previewLink: null,
      categorySlugs: ["satb", "piano", "classical"],
    },
  ];

  for (const song of demoSongs) {
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

  // ====== CREATE ADDITIONAL PUBLISHERS FOR ADMIN ROYALTY REPORTS ======
  console.log("\n📊 Creating test data for Admin Royalty Reports...");

  const adminRole = await prisma.role.findUnique({
    where: {
      name: RoleName.ADMIN,
    },
  });

  // Create an admin user if doesn't exist
  const adminUser = await prisma.user.upsert({
    where: {
      email: "admin@independentsheets.com",
    },
    update: {
      name: "Admin User",
      roleId: adminRole?.id,
    },
    create: {
      email: "admin@independentsheets.com",
      name: "Admin User",
      roleId: adminRole?.id || "",
    },
  });

  // Create multiple publishers
  const publisherEmails = [
    "sarah.mitchell@publisher.com",
    "james.chen@publisher.com",
    "emily.roberts@publisher.com",
  ];

  const publisherNames = [
    { first: "Sarah", last: "Mitchell" },
    { first: "James", last: "Chen" },
    { first: "Emily", last: "Roberts" },
  ];

  const publishersForRoyalties = [];

  for (let i = 0; i < publisherEmails.length; i++) {
    const pubUser = await prisma.user.upsert({
      where: {
        email: publisherEmails[i],
      },
      update: {
        name: `${publisherNames[i].first} ${publisherNames[i].last}`,
        roleId: publisherRole?.id,
      },
      create: {
        email: publisherEmails[i],
        firstName: publisherNames[i].first,
        lastName: publisherNames[i].last,
        name: `${publisherNames[i].first} ${publisherNames[i].last}`,
        roleId: publisherRole?.id || "",
      },
    });

    const publisher = await prisma.publisher.upsert({
      where: { userId: pubUser.id },
      update: {},
      create: {
        userId: pubUser.id,
        firstName: publisherNames[i].first,
        lastName: publisherNames[i].last,
        displayName: `${publisherNames[i].first} ${publisherNames[i].last}`,
        addressLine1: `${100 + i * 10} Music Street`,
        city: "Nashville",
        stateProvince: "TN",
        postalCode: `3720${i}`,
        country: "USA",
        phoneNumber: `615-555-000${i}`,
        paypalEmail: `${publisherEmails[i].split("@")[0]}@paypal.com`,
        preferredPaymentMethod: "paypal",
        uploadingOriginalWorks: true,
        uploadingArrangements: true,
        ownsOrControlsRights: true,
        acceptedAgreement: true,
      },
    });

    publishersForRoyalties.push(pubUser);

    // Create contract for each publisher
    await prisma.contract.upsert({
      where: { id: `contract-${pubUser.id}` },
      update: {},
      create: {
        id: `contract-${pubUser.id}`,
        artistId: pubUser.id,
        royaltyPercent: 75,
        startDate: new Date("2024-01-01"),
        endDate: null,
      },
    });
  }

  console.log(`✓ Created ${publishersForRoyalties.length} publishers with contracts`);

  // Create more customers
  const customerEmails = [
    "buyer1@example.com",
    "buyer2@example.com",
    "buyer3@example.com",
    "buyer4@example.com",
    "buyer5@example.com",
  ];

  const buyersForPurchases = [];

  for (const email of customerEmails) {
    const buyer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        firstName: email.split("@")[0],
        lastName: "Buyer",
        roleId: customerRole?.id || "",
      },
    });
    buyersForPurchases.push(buyer);
  }

  console.log(`✓ Created ${buyersForPurchases.length} test buyers`);

  // Create sheet music for the new publishers
  const songTitles = [
    "Amazing Grace",
    "The Water is Wide",
    "Shenandoah",
    "Simple Gifts",
    "Danny Boy",
    "Lux Aeterna",
    "Ave Verum Corpus",
    "O Magnum Mysterium",
  ];

  const sheetMusicList = [];

  for (const publisher of publishersForRoyalties) {
    for (let i = 0; i < 4; i++) {
      const song = await prisma.sheetMusic.create({
        data: {
          title: `${songTitles[i % songTitles.length]} (Arrangement ${i + 1})`,
          description: `Beautiful arrangement by ${publisher.name}`,
          priceCents: 399 + i * 100,
          pdfUrl: `https://example.com/music/${publisher.id}-${i}.pdf`,
          imageUrl: `https://example.com/covers/music-${i}.jpg`,
          artistId: publisher.id,
          previewMp3Url: `https://example.com/preview/${publisher.id}-${i}.mp3`,
          rightsVerified: true,
        },
      });
      sheetMusicList.push(song);
    }
  }

  console.log(`✓ Created ${sheetMusicList.length} sheet music items`);

  // Create multiple purchases and royalties
  let purchaseCount = 0;
  for (let i = 0; i < 30; i++) {
    const randomSheet = sheetMusicList[Math.floor(Math.random() * sheetMusicList.length)];
    const randomBuyer = buyersForPurchases[Math.floor(Math.random() * buyersForPurchases.length)];

    const purchase = await prisma.purchase.create({
      data: {
        buyerId: randomBuyer.id,
        sheetMusicId: randomSheet.id,
        amountCents: randomSheet.priceCents,
      },
    });

    // Create royalty split: 75% artist, 25% platform
    const artistAmount = Math.round(randomSheet.priceCents * 0.75);
    const platformAmount = randomSheet.priceCents - artistAmount;

    await prisma.royalty.create({
      data: {
        purchaseId: purchase.id,
        artistAmount,
        platformAmount,
      },
    });

    purchaseCount++;
  }

  console.log(`✓ Created ${purchaseCount} purchases with royalties\n`);

  // Print summary
  const totalRoyalties = await prisma.royalty.count();
  const totalContracts = await prisma.contract.count();
  const totalPublishers = await prisma.publisher.count();

  console.log("✅ Seed completed successfully!");
  console.log(`\n📊 Database Summary:`);
  console.log(`   • Total Royalties: ${totalRoyalties}`);
  console.log(`   • Total Contracts: ${totalContracts}`);
  console.log(`   • Total Publishers: ${totalPublishers}`);
  console.log(`   • Total Sheet Music: ${await prisma.sheetMusic.count()}`);
  console.log(`   • Total Purchases: ${await prisma.purchase.count()}`);
  console.log(`\n🎯 Test Accounts:`);
  console.log(`   • Admin: admin@independentsheets.com`);
  console.log(`   • Demo Publisher: demo.publisher@independentsheets.com`);
  console.log(`   • Demo Customer: demo.customer@independentsheets.com`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
