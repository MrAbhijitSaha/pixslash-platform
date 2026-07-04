"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcnui/tooltip";
import downloadWallpaper from "@/server/downloadAction";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type DownloadButtonProps = {
  imageUrl: string;
  title: string;
};

const DownloadButton = ({ imageUrl, title }: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await downloadWallpaper();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const link = document.createElement("a");

      link.href = `/wallpapers/posts/${imageUrl}`;
      link.download = `${title}.${imageUrl.split(".").pop()}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            size="icon"
            variant="secondary"
            aria-label="Download wallpaper"
            disabled={loading}
            onClick={handleDownload}
            className="bg-background/90 h-9 w-9 rounded-full backdrop-blur-md">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        }></TooltipTrigger>

      <TooltipContent>
        <p>{loading ? "Preparing..." : "Download"}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default DownloadButton;
