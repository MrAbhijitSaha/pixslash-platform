import { buttonVariants } from "@/components/shadcnui/button";
import { Card, CardDescription, CardTitle } from "@/components/shadcnui/card";
import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import { auth } from "@/lib/auth";
import getOwnWallpaper from "@/server/wallpaper/getOwnWallpaper";
import { PlusIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return notFound();
  }

  const getOwnPost = await getOwnWallpaper({
    userId: session.session.userId,
  });

  return (
    <section className="space-y-3 px-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-3xl font-bold">My Wallpapers</h1>
          <p className="text-black/70 dark:text-white/70">
            {getOwnPost.length} wallpapers Uploaded
          </p>
        </div>

        <Link
          href={"/upload"}
          className={buttonVariants({ variant: "default" })}>
          Upload
        </Link>
      </div>

      {getOwnPost.length === 0 && (
        <Card className="grid place-items-center gap-2 py-8">
          <PlusIcon />

          <CardTitle>No uploaded wallpapers yet</CardTitle>

          <CardDescription>
            You haven&apos;t uploaded any wallpapers yet. Start sharing your
            wallpapers with the community.
          </CardDescription>

          <Link
            href="/upload"
            className={buttonVariants({ variant: "default" })}>
            Upload Wallpaper
          </Link>
        </Card>
      )}

      {getOwnPost.length === 1 || getOwnPost.length === 2 ?
        <section className="grid grid-cols-3">
          <MasonryWallpaperGrid wallpapers={getOwnPost} />
        </section>
      : <MasonryWallpaperGrid wallpapers={getOwnPost} />}
    </section>
  );
};

export default page;
