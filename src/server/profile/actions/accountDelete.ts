"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const accountDelete = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        isSuccess: false,
        message: "Unauthorized",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        wallpapers: true,
      },
    });

    if (!user) {
      return {
        isSuccess: false,
        message: "User not found.",
      };
    }

    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    // Delete profile picture
    if (user.image) {
      try {
        await fs.unlink(`./public/user/profilepicture/${user.image}`);
      } catch (error) {
        console.error("Failed to delete old profile picture:", error);
      }
    }

    // Delete wallpaper images
    await Promise.all(
      user.wallpapers.map(async (wallpaper) => {
        try {
          await fs.unlink(`./public/wallpapers/posts/${wallpaper.imageUrl}`);
        } catch (error) {
          console.error(error);
        }
      }),
    );

    revalidatePath("/", "layout");

    return {
      isSuccess: true,
      message: "Account deleted successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      isSuccess: false,
      message: "Something went wrong.",
    };
  }
};

export default accountDelete;
