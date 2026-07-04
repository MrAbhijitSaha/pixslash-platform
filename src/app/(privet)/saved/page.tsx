import { buttonVariants } from "@/components/shadcnui/button";
import { Card, CardDescription, CardTitle } from "@/components/shadcnui/card";
import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import { auth } from "@/lib/auth";
import getSavedWallpaper from "@/server/wallpaper/getSavedWallpaper";
import { BookmarkIcon } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Saved Wallpaper | PixSlash",
  description: "Saved high-quality wallpapers to use it later",
  robots: {
    index: false,
    follow: false,
  },
};

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return notFound();
  }

  const getSavePost = await getSavedWallpaper({
    userId: session.session.userId,
  });

  return (
    <section className="space-y-3 px-6 pt-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Saved Wallpapers</h1>
        <p className="text-black/70 dark:text-white/70">
          {getSavePost.length} wallpapers saved
        </p>
      </div>

      {getSavePost.length === 0 ?
        <Card className="grid place-items-center gap-2 py-8">
          <BookmarkIcon />
          <CardTitle>No Saved wallpapers yet</CardTitle>
          <CardDescription>
            Browse wallpapers and click the bookmark icon to save them.
          </CardDescription>
          <Link
            href="/"
            className={buttonVariants({ variant: "default" })}>
            Browse Wallpapers
          </Link>
        </Card>
      : getSavePost.length <= 2 ?
        <section className="grid grid-cols-3">
          <MasonryWallpaperGrid wallpapers={getSavePost} />
        </section>
      : <MasonryWallpaperGrid wallpapers={getSavePost} />}
    </section>
  );
};

export default page;
