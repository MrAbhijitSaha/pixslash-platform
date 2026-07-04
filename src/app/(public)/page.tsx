import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import { auth } from "@/lib/auth";
import getAllWallpaper from "@/server/wallpaper/getAllWallpaper";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Stunning Free Wallpapers & Images | Pixslash",
  description:
    "The best free stock photos, royalty free images & Wallpapers shared by creators. Discover, collect stunning wallpapers. Pixslash is your destination for high-quality wallpapers.",
};

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const getAllWallpapers = await getAllWallpaper({
    userId: session?.session.userId,
  });

  if (getAllWallpapers.length === 0) {
    return (
      <div className="grid h-dvh place-items-center">No wallpapers found</div>
    );
  }

  return <MasonryWallpaperGrid wallpapers={getAllWallpapers} />;
};

export default page;
