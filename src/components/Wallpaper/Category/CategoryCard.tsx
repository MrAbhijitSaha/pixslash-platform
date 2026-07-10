import { buttonVariants } from "@/components/shadcnui/button";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  categoryImage: string;
  title: string;
  slug: string;
};

const CategoryCard = ({ categoryImage, title, slug }: CategoryCardProps) => {
  return (
    <Link
      href={`/category/${slug}` as Route}
      className={`${buttonVariants({ variant: "outline" })} my-4 h-full w-full rounded-full px-1 py-1 shadow`}>
      {categoryImage && (
        <Image
          src={`/categories/${categoryImage}`}
          alt={title}
          height={400}
          width={400}
          className="h-20 w-20 rounded-full object-cover"
        />
      )}

      {title}
    </Link>
  );
};

export default CategoryCard;
