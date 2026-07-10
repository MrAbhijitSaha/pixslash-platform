import { buttonVariants } from "@/components/shadcnui/button";
import WallpaperDetailsCard from "@/components/Wallpaper/Card/WallpaperDetailsCard";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import getDetailsOfWallpaper from "@/server/wallpaper/getDetailsOfWallpaper";
import { XIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    imgId: string;
  }>;
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
  };
};

const page = async ({ params }: PageProps) => {
  const { imgId } = await params;
  const wallpaper = await getDetailsOfWallpaper({ imgId });

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
