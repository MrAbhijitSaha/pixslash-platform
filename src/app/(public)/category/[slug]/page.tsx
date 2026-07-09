import { buttonVariants } from "@/components/shadcnui/button";
import { Card, CardDescription, CardTitle } from "@/components/shadcnui/card";
import MasonryWallpaperGrid from "@/components/Wallpaper/Grid/MaonaryWallpaperGrid";
import prisma from "@/lib/database/dbClient";
import getCategoiesWiseWallpaper from "@/server/wallpaper/getCategoiesWiseWallpaper";
import Image from "next/image";
import Link from "next/link";

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
    title: `${getInfo?.categoryName ?? "Category"} | PixSlash`,
  };
};

const page = async ({ params }: CategoriesPageProsp) => {
  const { slug } = await params;

  const wallpaperDependsOnCategory = await getCategoiesWiseWallpaper({ slug });

  if (wallpaperDependsOnCategory.length === 0) {
    return (
      <section className="grid h-[85dvh] place-items-center text-3xl">
        <Card className="max-w-[480px] gap-3 px-4 pb-4 text-center">
          <Image
            src={"/not-category.png"}
            height={400}
            width={400}
            alt="no-category"
            className="mx-auto mt-4 h-auto w-70"
          />

          <CardTitle>No Wallpaper Found On This Category</CardTitle>

          <CardDescription>
            There are currently no wallpapers available in this category. Please
            check back later or explore other categories.
          </CardDescription>

          <Link
            href={"/"}
            className={buttonVariants({ variant: "default" })}>
            Explore All Wallpapers
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <>
      {wallpaperDependsOnCategory.length <= 2 ?
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <MasonryWallpaperGrid wallpapers={wallpaperDependsOnCategory} />
        </section>
      : <MasonryWallpaperGrid wallpapers={wallpaperDependsOnCategory} />}
    </>
  );
};

export default page;
