import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import prisma from "@/lib/database/dbClient";
import getCategoiesWiseWallpaper from "@/server/wallpaper/getCategoiesWiseWallpaper";

type CategoriesPageProsp = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: CategoriesPageProsp) => {
  const { slug } = await params;

  const getInfo = await prisma.category.findUnique({
    where: {
      slug,
    },

    select: {
      categoryName: true,
    },
  });

  return {
    title: `${getInfo?.categoryName} | PixSlash`,
  };
};

const page = async ({ params }: CategoriesPageProsp) => {
  const { slug } = await params;

  const wallpaperDependsOnCategory = await getCategoiesWiseWallpaper({ slug });

  if (wallpaperDependsOnCategory.length === 0) {
    return (
      <section className="grid h-dvh place-items-center text-3xl">
        No Wallpapers Found on This Category
      </section>
    );
  }

  return (
    <>
      {wallpaperDependsOnCategory.length === 0 ?
        <section className="grid h-dvh place-items-center text-3xl">
          No Wallpapers Found on This Category
        </section>
      : wallpaperDependsOnCategory.length <= 2 ?
        <section className="grid grid-cols-3">
          <MasonryWallpaperGrid wallpapers={wallpaperDependsOnCategory} />
        </section>
      : <MasonryWallpaperGrid wallpapers={wallpaperDependsOnCategory} />}
    </>
  );
};

export default page;
