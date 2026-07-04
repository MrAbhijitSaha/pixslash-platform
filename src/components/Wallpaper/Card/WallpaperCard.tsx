import UserAvatar from "@/components/Dashboard/UserAvatar";
import { Card, CardContent } from "@/components/shadcnui/card";
import { WallpaperCardUserProps } from "@/lib/type";
import WallpaperAction from "./WallpaperAction";
import WallpaperImage from "./WallpaperImage";

type WallpaperCardProps = {
  info: WallpaperCardUserProps;
};

const WallpaperCard = ({ info }: WallpaperCardProps) => {
  const aspectRatioClass = getAspectRatioClass(info.width, info.height);
  return (
    <Card className="group w-full overflow-hidden rounded-xl border-0 p-0 shadow-sm transition-all duration-300 hover:cursor-pointer hover:shadow-xl">
      <CardContent
        className={`relative overflow-hidden px-0 py-0 ${aspectRatioClass}`}>
        <WallpaperImage
          imageUrl={info.imageUrl}
          slug={info.slug}
        />

        {/* top right  */}
        <div className="absolute top-3 right-3 z-20 flex -translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <WallpaperAction
            wallpaperId={info.id}
            likesCount={info._count.likes}
            imageUrl={info.imageUrl}
            title={info.title}
            isLiked={info.isLiked}
            isSaved={info.isSaved}
          />
        </div>

        {/* Bottom Section */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between p-4">
            {/* User */}
            <div className="flex items-center gap-2 py-2">
              <UserAvatar
                name={info.user?.name}
                image={info.user?.image}
                size="default"
              />

              <span className="text-sm font-medium text-white">
                {info.user?.name || "Anonymous"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WallpaperCard;

export function getAspectRatioClass(
  width: number | null,
  height: number | null,
): string {
  if (!width || !height) return "aspect-[4/3]";

  const ratio = width / height;

  if (ratio >= 2.1) return "aspect-[21/9]";
  if (ratio >= 1.7) return "aspect-video";
  if (ratio >= 1.25) return "aspect-[4/3]";
  if (ratio >= 0.95) return "aspect-square";
  if (ratio >= 0.7) return "aspect-[3/4]";

  return "aspect-[9/16]";
}
