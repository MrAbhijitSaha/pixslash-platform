"use client";

import Masonry from "react-masonry-css";

import { WallpaperCardUserProps } from "@/lib/type";
import WallpaperCard from "../Card/WallpaperCard";

const breakpointColumns = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};

type MasonryWallpaperGridProps = {
  wallpapers: WallpaperCardUserProps[];
};

const MasonryWallpaperGrid = ({ wallpapers }: MasonryWallpaperGridProps) => {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid-column">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          info={wallpaper}
        />
      ))}
    </Masonry>
  );
};

export default MasonryWallpaperGrid;
