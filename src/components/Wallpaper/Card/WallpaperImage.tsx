import { Route } from "next";
import Image from "next/image";
import Link from "next/link";

type WallpaperImageProps = {
  imageUrl: string;
  slug: string;
};

const WallpaperImage = ({ imageUrl, slug }: WallpaperImageProps) => {
  return (
    <Link
      href={`/photo/${slug}` as Route}
      className="absolute inset-0">
      <Image
        src={`/wallpapers/posts/${imageUrl}`}
        alt={slug}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="h-auto w-full overflow-hidden object-cover"
      />
    </Link>
  );
};

export default WallpaperImage;
