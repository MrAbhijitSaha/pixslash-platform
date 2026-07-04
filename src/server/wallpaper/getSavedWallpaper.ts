"use server";

import prisma from "@/lib/database/dbClient";

type GetSavedWallpaperProps = {
  userId?: string;
};

const getSavedWallpaper = async ({ userId }: GetSavedWallpaperProps) => {
  if (!userId) return [];

  const savedWallpapers = await prisma.savedPost.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      wallpaper: {
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
      },
    },
  });

  const likes = await prisma.like.findMany({
    where: {
      userId,
    },
    select: {
      wallpaperId: true,
    },
  });

  const likedIds = new Set(likes.map((like) => like.wallpaperId));

  return savedWallpapers.map((saved) => ({
    ...saved.wallpaper,
    isLiked: likedIds.has(saved.wallpaper.id),
    isSaved: true,
  }));
};

export default getSavedWallpaper;
