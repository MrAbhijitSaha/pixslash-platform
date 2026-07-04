"use client";

import { authClient } from "@/lib/auth-client";
import toggleSave from "@/server/toggleSave";
import { BookmarkIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../shadcnui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../shadcnui/tooltip";
type SaveButtonProps = {
  wallpaperId: string;
  initialSaved: boolean;
  buttonContent?: ReactNode;
  buttonVariant:
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "outline"
    | "link";
};

const SaveButton = ({
  initialSaved,
  wallpaperId,
  buttonContent,
  buttonVariant,
}: SaveButtonProps) => {
  const [isSaved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [showError, setError] = useState<string>();
  const { data } = authClient.useSession();
  const pathname = usePathname();
  const { refresh } = useRouter();
  const saveHandler = async () => {
    if (!data) {
      setError("Please login first");
      return;
    }

    if (loading) return;

    const previousSaved = isSaved;

    // instant UI change
    setSaved(!isSaved);

    setLoading(true);

    try {
      const { isSuccess, message, saved } = await toggleSave(wallpaperId);

      if (!isSuccess) {
        // rollback
        setSaved(previousSaved);
        toast.error(message);
        return;
      }

      // sync with server
      setSaved(saved ?? previousSaved);

      toast.success(message);
      refresh();
    } catch {
      // rollback on error
      setSaved(previousSaved);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Tooltip>
      <Button
        variant={buttonVariant}
        aria-label="Save wallpaper"
        onClick={saveHandler}
        disabled={loading}
        className={`${buttonContent ? "bg-background/90 w-auto rounded-full px-4" : "bg-background/90 h-9 w-9 rounded-full backdrop-blur-md"}`}
        render={
          <TooltipTrigger>
            <BookmarkIcon className={isSaved ? "h-4 w-4 fill-current" : ""} />

            {buttonContent && (
              <span className="text-sm font-semibold">{buttonContent}</span>
            )}
          </TooltipTrigger>
        }
      />

      {pathname === "/saved" ? null : (
        <TooltipContent>
          {!data ? (showError ?? "Please login first") : "I want to save this"}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default SaveButton;
