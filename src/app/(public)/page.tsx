import { Separator } from "@/components/shadcnui/separator";
import CategorySlider from "@/components/Wallpaper/Category/CategorySlider";
import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import getAllWallpaper from "@/server/wallpaper/getAllWallpaper";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Stunning Free Wallpapers & Images | Pixslash",
  description:
    "The best free stock photos, royalty free images & Wallpapers shared by creators. Discover, collect stunning wallpapers. Pixslash is your destination for high-quality wallpapers.",
};

const page = async () => {
  const [getAllWallpapers, getCategory] = await Promise.all([
    await getAllWallpaper(),
    await prisma.category.findMany(),
  ]);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let isLogin = false;

  if (session) {
    isLogin = true;
  }

  if (getAllWallpapers.length === 0) {
    return (
      <div className="grid h-dvh place-items-center">No wallpapers found</div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold">Wallpapers</h1>
      <p className="pt-1 pb-4 text-[16px] tracking-wider text-black/70 dark:text-white/70">
        The best free stock photos, royalty free images shared by creators.
      </p>

      <Separator />

      {getCategory && (
        <section className={isLogin ? "md:max-w-lg lg:max-w-4xl" : ""}>
          <h2 className="pt-4 text-2xl">Popular Wallpaper Categories</h2>
          <CategorySlider
            categoryInfo={getCategory}
            chechklogin={isLogin}
          />
        </section>
      )}

      <MasonryWallpaperGrid wallpapers={getAllWallpapers} />
    </>
  );
};

export default page;
