import UploadWallpaper from "@/components/Dashboard/UploadWallpaper";
import prisma from "@/lib/database/dbClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Wallpaper | PixSlash",
  description:
    "Upload high-quality wallpapers to share with the PixSlash community.",
  robots: {
    index: false,
    follow: false,
  },
};

const page = async () => {
  const [getCategories, getTags] = await Promise.all([
    prisma.category.findMany(),
    prisma.tag.findMany(),
  ]);

  return (
    <section className="grid h-auto px-4 py-4 md:place-items-center md:px-0 md:py-0 lg:h-[80dvh]">
      <UploadWallpaper
        categoryInfo={getCategories}
        tagInfo={getTags}
      />
    </section>
  );
};

export default page;
