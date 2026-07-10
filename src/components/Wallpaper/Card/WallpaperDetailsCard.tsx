"use client";

import UserAvatar from "@/components/Dashboard/UserAvatar";
import { Button, buttonVariants } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcnui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/shadcnui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnui/dropdown-menu";
import { Skeleton } from "@/components/shadcnui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcnui/tooltip";
import CommentBox from "@/components/Wallpaper/Actions/CommentBox";
import { authClient } from "@/lib/auth-client";
import formatFileSize from "@/lib/formatFileSize";
import { WallpaperDetailsCardType } from "@/lib/type";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ChevronsUpDownIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  InfoIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DeleteCommentButton from "../Actions/DeleteCommentButton";
import LikeButton from "../Actions/LikeButton";
import SaveButton from "../Actions/SaveButton";

type WallpaperDetailsCardProps = {
  getDetails: WallpaperDetailsCardType;
  isLiked: boolean;
  isSaved: boolean;
};

const WallpaperDetailsCard = ({
  getDetails,
  isSaved,
  isLiked,
}: WallpaperDetailsCardProps) => {
  const formattedFileSize = formatFileSize(getDetails.fileSize ?? 1024);
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);

  return (
    <Card className="py-0">
      <CardHeader className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <UserAvatar
            name={getDetails.user?.name}
            image={getDetails.user?.image}
            size="lg"
          />

          <span>{getDetails.user?.name || "Anonymous"}</span>
        </div>

        <Button
          variant="secondary"
          aria-label="Download wallpaper"
          className="rounded-lg bg-green-500 text-white backdrop-blur-md hover:bg-green-600">
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden md:block">Download</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger>
              <Image
                src={`/wallpapers/posts/${getDetails.imageUrl}`}
                alt={`image - ${getDetails.title}`}
                height={getDetails.height ?? 800}
                width={getDetails.width ?? 1200}
                loading="eager"
                className="h-auto w-full cursor-zoom-in rounded-lg object-contain md:h-94"
              />
            </DialogTrigger>

            <DialogContent className="w-full! max-w-5xl! py-6">
              <Image
                src={`/wallpapers/posts/${getDetails.imageUrl}`}
                alt={`image - ${getDetails.title}`}
                height={getDetails.height ?? 800}
                width={getDetails.width ?? 1200}
                onClick={() => setOpen(false)}
                loading="lazy"
                className="h-140 w-full cursor-zoom-out rounded-lg object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
          {/* wallpaper text Context  */}
          <div className="">
            <CardTitle>{getDetails.title ?? undefined}</CardTitle>
            <CardDescription>
              {getDetails.description ?? undefined}
            </CardDescription>
          </div>

          {/* wallpaper card features  */}
          <div className="flex items-center gap-2 md:ml-auto">
            {/* like system  */}
            <LikeButton
              wallpaperId={getDetails.id}
              initialCount={getDetails._count.likes}
              initialLiked={isLiked}
              tooltipContent={<p>I love This</p>}
            />

            {/* save system  */}
            <SaveButton
              buttonContent="Save"
              buttonVariant="outline"
              wallpaperId={getDetails.id}
              initialSaved={isSaved}
            />

            {/* information system  */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({
                  size: "icon",
                  variant: "outline",
                  className:
                    "bg-background/90 flex w-auto gap-1 rounded-full px-4 backdrop-blur-md",
                })}>
                <InfoIcon className="h-4 w-4" />
                <span className="text-sm font-semibold">Info</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>
                  Format ( {getDetails.format} )
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Size ( {formattedFileSize} )
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {getDetails.wallpaperTags.length !== 0 && (
          <>
            <CardTitle>Tags </CardTitle>
            <div className="space-x-3">
              {getDetails.wallpaperTags.map((wt) => (
                <div
                  key={wt.tag.id}
                  className={buttonVariants({ variant: "default" })}>
                  {wt.tag.title}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <Collapsible>
        {/* Comment section  */}
        <section className="bg-black/2 pt-2 dark:bg-black/50">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 py-2 text-[16px] font-semibold">
              {getDetails._count.comments.toLocaleString()} Comments
              <Tooltip>
                <CollapsibleTrigger
                  render={
                    <TooltipTrigger>
                      <ChevronsUpDownIcon />
                    </TooltipTrigger>
                  }
                  className={buttonVariants({
                    size: "icon",
                    variant: "ghost",
                    className: "size-8",
                  })}></CollapsibleTrigger>
                <TooltipContent>
                  <p>Show Comments</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list-sort-descending-icon lucide-list-sort-descending">
                  <path d="M15 12H3" />
                  <path d="M3 5h18" />
                  <path d="M9 19H3" />
                </svg>
                Sort By
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem>Newest Comments</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Oldest Comments</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="px-4 py-2">
            {isPending ?
              <Skeleton className="h-8 w-8 rounded-full" />
            : !user ?
              <div className="flex gap-2">
                <div className="bg-accent h-10 w-10 rounded-full px-2 py-2">
                  <User />
                </div>
                <div className="w-full">
                  <CommentBox wallpaperId={getDetails.id} />
                </div>
              </div>
            : <div className="flex gap-2">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  size="default"
                />

                <CommentBox wallpaperId={getDetails.id} />
              </div>
            }
          </div>

          <CollapsibleContent className="space-y-3 px-4 py-4">
            {getDetails.comments.map((c) => {
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 shadow-md dark:bg-black/95">
                  <div className="flex gap-3">
                    <UserAvatar
                      image={c.user.image}
                      name={c.user.name}
                      size="default"
                    />

                    <div className="">
                      <CardTitle className="text-sm">
                        {c.user.name}{" "}
                        <span className="text-[12px] font-normal text-black/55 dark:text-white/55">
                          {formatDistanceToNowStrict(c.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </CardTitle>

                      <CardDescription>{c.opinion}</CardDescription>
                    </div>
                  </div>

                  {data?.session.userId === c.user.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVerticalIcon size={16} />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DeleteCommentButton commentId={c.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              );
            })}
          </CollapsibleContent>
        </section>
      </Collapsible>
    </Card>
  );
};

export default WallpaperDetailsCard;
