import { buttonVariants } from "@/components/shadcnui/button";
import WallpaperDetailsCard from "@/components/Wallpaper/Card/WallpaperDetailsCard";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { XIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    imgId: string;
  }>;
};

const getWallPaper = async (imgId: string) => {
  return await prisma.wallpaper.findUnique({
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
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { imgId } = await params;

  const wallpaper = await prisma.wallpaper.findUnique({
    where: {
      slug: imgId,
      isPublic: true,
    },
    select: {
      title: true,
      description: true,
      imageUrl: true,
    },
  });

  if (!wallpaper) {
    return {
      title: "Wallpaper Not Found",
    };
  }

  return {
    title: `${wallpaper.title} | Pixslash`,
    description:
      wallpaper.description ??
      `Download ${wallpaper.title} wallpaper in HD, QHD and 4K quality.`,

    openGraph: {
      title: wallpaper.title,
      description:
        wallpaper.description ??
        `Download ${wallpaper.title} wallpaper in HD, QHD and 4K quality.`,
      images: [
        {
          url: wallpaper.imageUrl,
          width: 1200,
          height: 630,
          alt: wallpaper.title,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: wallpaper.title,
      description:
        wallpaper.description ??
        `Download ${wallpaper.title} wallpaper in HD, QHD and 4K quality.`,
      images: [wallpaper.imageUrl],
    },
  };
};

const page = async ({ params }: PageProps) => {
  const { imgId } = await params;
  const wallpaper = await getWallPaper(imgId);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!wallpaper) {
    notFound();
  }

  let isLiked = false;

  if (session?.user?.id) {
    const like = await prisma.like.findUnique({
      where: {
        userId_wallpaperId: {
          userId: session.user.id,
          wallpaperId: wallpaper.id,
        },
      },
    });
    isLiked = !!like;
  }

  let isSaved = false;

  if (session?.user.id) {
    const save = await prisma.savedPost.findUnique({
      where: {
        userId_wallpaperId: {
          userId: session.user.id,
          wallpaperId: wallpaper.id,
        },
      },
    });

    isSaved = !!save;
  }

  return (
    <section className="gap-2 md:flex">
      <Link
        href={"/"}
        className={buttonVariants({ variant: "ghost" })}>
        <XIcon />
      </Link>

      <div className="w-full">
        <WallpaperDetailsCard
          getDetails={wallpaper}
          isLiked={isLiked}
          isSaved={isSaved}
        />
      </div>
    </section>
  );
};

export default page;
