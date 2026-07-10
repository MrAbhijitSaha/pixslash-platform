"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

type GetCategoiesWiseWallpaperProps = {
  slug: string;
};

const getCategoiesWiseWallpaper = async ({
  slug,
}: GetCategoiesWiseWallpaperProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.session.userId;

  // get wallpaper depend on category
  const wallpapers = await prisma.wallpaper.findMany({
    where: {
      category: {
        slug,
      },
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

  if (!userId) {
    return wallpapers.map((wallpaper) => ({
      ...wallpaper,
      isLiked: false,
      isSaved: false,
    }));
  }

  const [likes, saves] = await Promise.all([
    prisma.like.findMany({
      where: { userId },
      select: { wallpaperId: true },
    }),
    prisma.savedPost.findMany({
      where: { userId },
      select: { wallpaperId: true },
    }),
  ]);

  const likedIds = new Set(likes.map((like) => like.wallpaperId));
  const savedIds = new Set(saves.map((save) => save.wallpaperId));

  return wallpapers.map((wallpaper) => ({
    ...wallpaper,
    isLiked: likedIds.has(wallpaper.id),
    isSaved: savedIds.has(wallpaper.id),
  }));
};

export default getCategoiesWiseWallpaper;
