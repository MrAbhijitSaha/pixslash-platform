import { serverEnv } from "@/lib/env/serverEnv";
import { PrismaClient } from "@generated/prisma/client";
import { hash as argon2Hash } from "@node-rs/argon2";
import { PrismaLibSql } from "@prisma/adapter-libsql";
const adapter = new PrismaLibSql({
  url: serverEnv.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const hashPassword = async (password: string) => {
  return await argon2Hash(password, {
    secret: Buffer.from(serverEnv.BETTER_AUTH_SECRET),
  });
};

const main = async () => {
  console.log("Starting database seeding...");

  try {
    // wallpaper catagories
    const categories = [
      {
        categoryName: "Nature",
        slug: "nature",
      },
      {
        categoryName: "Technology",
        slug: "technology",
      },
      {
        categoryName: "Gaming",
        slug: "gaming",
      },
      {
        categoryName: "Cars",
        slug: "cars",
      },
      {
        categoryName: "Anime",
        slug: "anime",
      },
      {
        categoryName: "Space",
        slug: "space",
      },
      {
        categoryName: "Architecture",
        slug: "architecture",
      },
      {
        categoryName: "Abstract",
        slug: "abstract",
      },
      {
        categoryName: "Minimal",
        slug: "minimal",
      },
      {
        categoryName: "Animals",
        slug: "animals",
      },
    ];

    // wallpaper tags
    const tags = [
      {
        title: "4k",
        slug: "4k",
      },
      {
        title: "hd",
        slug: "hd",
      },
      {
        title: "amoled",
        slug: "amoled",
      },
      {
        title: "nature",
        slug: "nature",
      },
      {
        title: "forest",
        slug: "forest",
      },
      {
        title: "mountain",
        slug: "mountain",
      },
      {
        title: "sunset",
        slug: "sunset",
      },
      {
        title: "gaming",
        slug: "gaming",
      },
      {
        title: "anime",
        slug: "anime",
      },
      {
        title: "car",
        slug: "car",
      },
      {
        title: "space",
        slug: "space",
      },
      {
        title: "dark",
        slug: "dark",
      },
      {
        title: "minimal",
        slug: "minimal",
      },
      {
        title: "abstract",
        slug: "abstract",
      },
      {
        title: "city",
        slug: "city",
      },
      {
        title: "ocean",
        slug: "ocean",
      },
      {
        title: "flowers",
        slug: "flowers",
      },
      {
        title: "wildlife",
        slug: "wildlife",
      },
      {
        title: "technology",
        slug: "technology",
      },
      {
        title: "future",
        slug: "future",
      },
    ];

    // Inster catagories in Db
    const createdCategories = await Promise.all(
      categories.map((item) => {
        return prisma.category.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }),
    );

    // Inster tags in Db
    const createdTags = await Promise.all(
      tags.map((item) => {
        return prisma.tag.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }),
    );

    console.log(
      `Seeded ${createdCategories.length} categories and ${createdTags.length} tags`,
    );

    // create map
    // const categoryMap = Object.fromEntries(
    //   createdCategories.map((c) => [c.slug, c.id]),
    // );
    // const tagMap = Object.fromEntries(createdTags.map((t) => [t.slug, t.id]));

    const users = [
      {
        name: "Lionel Messi",
        email: "messi@gmail.com",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?w=400",
      },
      {
        name: "Cristiano Ronaldo",
        email: "ronaldo@gmail.com",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      },
      {
        name: "Neymar Jr",
        email: "neymar@gmail.com",
        image:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400",
      },
      {
        name: "Kylian Mbappe",
        email: "mbappe@gmail.com",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
      {
        name: "Kevin De Bruyne",
        email: "debruyne@gmail.com",
        image:
          "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400",
      },
      {
        name: "Erling Haaland",
        email: "haaland@gmail.com",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      },
    ];

    const userPassword = await hashPassword("pass123456");

    const seededUsers = await Promise.all(
      users.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email,
          },
          update: {},
          create: {
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: false,
            accounts: {
              create: {
                providerId: "credential",
                accountId: user.email,
                password: userPassword,
              },
            },
          },
        }),
      ),
    );

    console.log(`✅ Seeded ${seededUsers.length} users`);

    // Create users map

    // const userMap = Object.fromEntries(seededUsers.map((s) => [s.email, s.id]));

    // create sample wallpaper data
    // const demoWallpapers = [
    //   {
    //     title: "Desert Dunes",
    //     slug: "desert-dunes",
    //     category: "nature",
    //     description: "Golden sand dunes under the afternoon sun",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "messi@gmail.com",
    //     tags: ["desert", "nature", "4k"],
    //   },
    //   {
    //     title: "Cyberpunk Street",
    //     slug: "cyberpunk-street",
    //     category: "gaming",
    //     description: "Neon-lit futuristic city street",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "ronaldo@gmail.com",
    //     tags: ["cyberpunk", "gaming", "neon"],
    //   },
    //   {
    //     title: "Galaxy Horizon",
    //     slug: "galaxy-horizon",
    //     category: "space",
    //     description: "Milky Way stretching over the horizon",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "neymar@gmail.com",
    //     tags: ["space", "galaxy", "4k"],
    //   },
    //   {
    //     title: "Tokyo Rain",
    //     slug: "tokyo-rain",
    //     category: "anime",
    //     description: "Rainy city street inspired by anime aesthetics",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 1920,
    //     height: 1080,
    //     format: "jpg",
    //     owner: "mbappe@gmail.com",
    //     tags: ["anime", "rain", "city"],
    //   },
    //   {
    //     title: "Luxury Supercar",
    //     slug: "luxury-supercar",
    //     category: "cars",
    //     description: "Exotic supercar parked near skyscrapers",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "haaland@gmail.com",
    //     tags: ["car", "sports", "4k"],
    //   },
    //   {
    //     title: "Dark AMOLED Mountain",
    //     slug: "dark-amoled-mountain",
    //     category: "minimal",
    //     description: "Minimal mountain silhouette on black background",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1440&h=3200&q=80",
    //     width: 1440,
    //     height: 3200,
    //     format: "jpg",
    //     owner: "debruyne@gmail.com",
    //     tags: ["amoled", "minimal", "dark"],
    //   },
    //   {
    //     title: "Blue Abstract Flow",
    //     slug: "blue-abstract-flow",
    //     category: "abstract",
    //     description: "Smooth blue flowing abstract shapes",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 2560,
    //     height: 1440,
    //     format: "jpg",
    //     owner: "messi@gmail.com",
    //     tags: ["abstract", "blue", "hd"],
    //   },
    //   {
    //     title: "Snow Wolf",
    //     slug: "snow-wolf",
    //     category: "animals",
    //     description: "White wolf standing in the snow",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "ronaldo@gmail.com",
    //     tags: ["wolf", "animal", "4k"],
    //   },
    //   {
    //     title: "Green Matrix Code",
    //     slug: "green-matrix-code",
    //     category: "technology",
    //     description: "Digital code streaming in green",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "neymar@gmail.com",
    //     tags: ["technology", "code", "dark"],
    //   },
    //   {
    //     title: "Northern Lights",
    //     slug: "northern-lights",
    //     category: "nature",
    //     description: "Aurora borealis over snowy landscape",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "mbappe@gmail.com",
    //     tags: ["aurora", "nature", "4k"],
    //   },
    //   {
    //     title: "Space Station View",
    //     slug: "space-station-view",
    //     category: "space",
    //     description: "Earth viewed from a futuristic space station",
    //     imageUrl:
    //       "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&h=1080&q=80",
    //     width: 3840,
    //     height: 2160,
    //     format: "jpg",
    //     owner: "debruyne@gmail.com",
    //     tags: ["space", "earth", "future"],
    //   },
    // ];

    // 👇 CLEANUP HERE
    // const seededImageUrls = demoWallpapers.map((wp) => wp.imageUrl);

    // await prisma.comment.deleteMany({
    //   where: {
    //     wallpaper: {
    //       imageUrl: {
    //         in: seededImageUrls,
    //       },
    //     },
    //   },
    // });

    // await prisma.like.deleteMany({
    //   where: {
    //     wallpaper: {
    //       imageUrl: {
    //         in: seededImageUrls,
    //       },
    //     },
    //   },
    // });

    // await prisma.wallpaperTag.deleteMany({
    //   where: {
    //     wallpaper: {
    //       imageUrl: {
    //         in: seededImageUrls,
    //       },
    //     },
    //   },
    // });

    // await prisma.wallpaper.deleteMany({
    //   where: {
    //     imageUrl: {
    //       in: seededImageUrls,
    //     },
    //   },
    // });

    // console.log("🧹 Cleaned existing demo data");

    // const createdWallpapers = [];

    // for (const dw of demoWallpapers) {
    //   const wallpaper = await prisma.wallpaper.create({
    //     data: {
    //       title: dw.title,
    //       slug: dw.slug,
    //       description: dw.description,
    //       imageUrl: dw.imageUrl,
    //       thumbnailUrl: dw.imageUrl.replace("w=1920", "w=480"),

    //       width: dw.width,
    //       height: dw.height,
    //       format: dw.format,

    //       fileSize: Math.floor(Math.random() * 5000000) + 500000,
    //       isPublic: true,
    //       isFeatured: Math.random() > 0.7,

    //       category: {
    //         connect: {
    //           id: categoryMap[dw.category],
    //         },
    //       },

    //       user: {
    //         connect: {
    //           id: userMap[dw.owner],
    //         },
    //       },

    //       wallpaperTags: {
    //         create: dw.tags
    //           .filter((tag) => tagMap[tag])
    //           .map((tag) => ({
    //             tag: {
    //               connect: {
    //                 id: tagMap[tag],
    //               },
    //             },
    //           })),
    //       },
    //     },
    //   });

    //   createdWallpapers.push(wallpaper);
    // }

    // console.log(`Seeded ${createdWallpapers.length} wallpapers`);

    // const comments = [
    //   "Amazing wallpaper! 🔥",
    //   "This looks beautiful.",
    //   "Perfect for my desktop background.",
    //   "Love the colors in this image.",
    //   "One of the best wallpapers I've seen.",
    //   "Great composition and quality.",
    //   "Downloading this right now!",
    //   "Looks stunning in 4K.",
    //   "Very relaxing wallpaper.",
    //   "Awesome shot!",
    //   "This is my favorite wallpaper.",
    //   "Fantastic work!",
    //   "Clean and minimal design.",
    //   "Absolutely gorgeous.",
    //   "Really impressive image.",
    // ];

    // const commentData: {
    //   userId: string;
    //   wallpaperId: string;
    //   opinion: string;
    // }[] = [];

    // for (const wallpaper of createdWallpapers) {
    //   const commentCount = Math.floor(Math.random() * 4) + 2;

    //   const availableUsers = [...seededUsers].sort(() => Math.random() - 0.5);

    //   const selectedUsers = availableUsers.slice(0, commentCount);

    //   for (const user of selectedUsers) {
    //     commentData.push({
    //       userId: user.id,
    //       wallpaperId: wallpaper.id,
    //       opinion: comments[Math.floor(Math.random() * comments.length)],
    //     });
    //   }
    // }

    // await prisma.comment.createMany({
    //   data: commentData,
    // });

    // const likeData: {
    //   userId: string;
    //   wallpaperId: string;
    // }[] = [];

    // const usedPairs = new Set<string>();

    // for (const wallpaper of createdWallpapers) {
    //   const likeCount = Math.floor(Math.random() * seededUsers.length) + 1;

    //   const shuffledUsers = [...seededUsers].sort(() => Math.random() - 0.5);

    //   const selectedUsers = shuffledUsers.slice(0, likeCount);

    //   for (const user of selectedUsers) {
    //     const key = `${user.id}-${wallpaper.id}`;

    //     if (!usedPairs.has(key)) {
    //       usedPairs.add(key);

    //       likeData.push({
    //         userId: user.id,
    //         wallpaperId: wallpaper.id,
    //       });
    //     }
    //   }
    // }

    // await prisma.like.createMany({
    //   data: likeData,
    // });

    // console.log(`✅ Seeded ${likeData.length} likes`);

    // console.log(`✅ Seeded ${commentData.length} comments`);
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    console.log("Disconnecting from database...");
    await prisma.$disconnect();
    console.log("Disconnected successfully");
  }
};

main().catch((e) => {
  console.error("Fatal error during seeding:", e);
  process.exit(1);
});
