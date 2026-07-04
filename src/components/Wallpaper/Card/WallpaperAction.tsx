import DownloadButton from "../Actions/DownloadButton";
import LikeButton from "../Actions/LikeButton";
import SaveButton from "../Actions/SaveButton";

type WallpaperActionProps = {
  wallpaperId: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  imageUrl: string;
  title: string;
};

const WallpaperAction = ({
  wallpaperId,
  likesCount,
  isLiked,
  isSaved,
  imageUrl,
  title,
}: WallpaperActionProps) => {
  return (
    <div className="absolute top-3 right-3 z-20 flex -translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <SaveButton
        wallpaperId={wallpaperId}
        initialSaved={isSaved}
        buttonVariant="secondary"
      />

      <LikeButton
        wallpaperId={wallpaperId}
        initialCount={likesCount}
        initialLiked={isLiked}
      />

      <DownloadButton
        imageUrl={imageUrl}
        title={title}
      />
    </div>
  );
};

export default WallpaperAction;
