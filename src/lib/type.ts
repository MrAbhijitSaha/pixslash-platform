import { Prisma } from "@generated/prisma/client";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import z from "zod";
import {
  commentSchema,
  loginSchema,
  profileInformationSchema,
  registerSchema,
  wallpaperUploadSchema,
} from "./zodSchema";

export type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type LayoutChildrenProps = {
  children: ReactNode;
};

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export type LoginSchemaType = z.infer<typeof loginSchema>;

export type CommentSchemaType = z.infer<typeof commentSchema>;

export type WallpaperUploadSchemaType = z.infer<typeof wallpaperUploadSchema>;

export type ProfileInformationSchemaType = z.infer<
  typeof profileInformationSchema
>;

export type SideBarNavItemType = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export type AppSidebarProps = {
  userId: string;
};

export type UserAvatarProps = {
  name: string | undefined;
  image: string | null | undefined;
  size?: "lg" | "sm" | "default";
};

export type WallpaperCardUserProps = Prisma.WallpaperGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    _count: {
      select: {
        likes: true;
      };
    };
  };
}> & {
  isLiked: boolean;
  isSaved: boolean;
};

export type WallpaperDetailsCardType = Prisma.WallpaperGetPayload<{
  omit: {
    thumbnailUrl: true;
    updatedAt: true;
    categoryId: true;
  };

  include: {
    category: {
      select: {
        categoryName: true;
      };
    };

    user: {
      select: {
        name: true;
        image: true;
      };
    };

    wallpaperTags: {
      select: {
        tag: {
          select: {
            title: true;
            slug: true;
            id: true;
          };
        };
      };
    };

    comments: {
      orderBy: {
        createdAt: "desc";
      };

      select: {
        id: true;
        opinion: true;
        createdAt: true;

        user: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };

    _count: {
      select: {
        likes: true;
        comments: true;
      };
    };
  };
}>;

export type SavedWallpaperCardType = Prisma.SavedPostGetPayload<{
  orderBy: [
    {
      createdAt: "desc";
    },
    {
      id: "desc";
    },
  ];
  select: {
    createdAt: true;

    wallpaper: {
      select: {
        id: true;
        imageUrl: true;
        height: true;
        width: true;
        title: true;
        description: true;
        slug: true;
        thumbnailUrl: true;

        user: {
          select: {
            id: true;
            image: true;
            name: true;
          };
        };
      };
    };
  };
}>;
