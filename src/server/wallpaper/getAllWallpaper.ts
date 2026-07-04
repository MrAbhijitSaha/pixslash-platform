"use server";

import prisma from "@/lib/database/dbClient";

type GetAllWallpapersProps = {
  userId?: string;
};

const getAllWallpaper = async ({ userId }: GetAllWallpapersProps) => {
  // 1. Get all public wallpapers
  const wallpapers = await prisma.wallpaper.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Guest user
  if (!userId) {
    return wallpapers.map((wallpaper) => ({
      ...wallpaper,
      isLiked: false,
      isSaved: false,
    }));
  }

  // 2. Fetch all likes & saves in parallel
  const [likes, saves] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        wallpaperId: true,
      },
    }),

    prisma.savedPost.findMany({
      where: {
        userId,
      },
      select: {
        wallpaperId: true,
      },
    }),
  ]);

  // 3. Convert to Set for O(1) lookup
  const likedIds = new Set(likes.map((like) => like.wallpaperId));

  const savedIds = new Set(saves.map((save) => save.wallpaperId));

  // 4. Merge
  return wallpapers.map((wallpaper) => ({
    ...wallpaper,
    isLiked: likedIds.has(wallpaper.id),
    isSaved: savedIds.has(wallpaper.id),
  }));
};

export default getAllWallpaper;
