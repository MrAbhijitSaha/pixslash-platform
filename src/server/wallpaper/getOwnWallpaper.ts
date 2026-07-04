"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

const getOwnWallpaper = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.session.userId;

  if (!userId) return [];

  const wallpapers = await prisma.wallpaper.findMany({
    where: {
      userId,
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

export default getOwnWallpaper;
