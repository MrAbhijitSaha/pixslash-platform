"use server";

import prisma from "@/lib/database/dbClient";
import { notFound } from "next/navigation";

type getDetailsOfWallpaperProps = {
  imgId: string;
};

const getDetailsOfWallpaper = async ({ imgId }: getDetailsOfWallpaperProps) => {
  if (!imgId) {
    return notFound();
  }

  try {
    return await prisma.wallpaper.findUniqueOrThrow({
      where: {
        slug: imgId,
        isPublic: true,
      },
      omit: {
        thumbnailUrl: true,
        updatedAt: true,
        categoryId: true,
      },

      include: {
        category: {
          select: {
            categoryName: true,
          },
        },

        wallpaperTags: {
          select: {
            tag: {
              select: {
                title: true,
                slug: true,
                id: true,
              },
            },
          },
        },

        user: {
          select: {
            name: true,
            image: true,
          },
        },

        comments: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            opinion: true,
            createdAt: true,

            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  } catch (eror) {
    console.error(eror);
    notFound();
  }
};

export default getDetailsOfWallpaper;
