"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import sharp from "sharp";

const uploadProfilePicture = async (img: File) => {
  if (!img) {
    return {
      isSuccess: false,
      message: "Please select an image",
    };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        isSuccess: false,
        message: "Please login first!",
      };
    }

    // File size validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (img.size > MAX_FILE_SIZE) {
      return {
        isSuccess: false,
        message: "Image size must be less than 5MB.",
      };
    }

    // Convert File -> Buffer
    const imgBuffer = await img.arrayBuffer();

    const metadata = await sharp(imgBuffer).metadata();

    // Image formats
    const allowedFormats = ["png", "jpeg", "webp"];

    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      return {
        isSuccess: false,
        message: "Only PNG, JPG, JPEG, and WEBP images are allowed.",
      };
    }

    // Get old profile image
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        image: true,
      },
    });

    // Image name
    const extension = metadata.format === "jpeg" ? "jpg" : metadata.format;
    const imgId = `${randomUUID()}.${extension}`;

    await fs.mkdir("./public/user/profilepicture", { recursive: true });

    await sharp(imgBuffer)
      .resize({
        width: 400,
        height: 400,
        fit: "cover",
      })
      .toFile(`./public/user/profilepicture/${imgId}`);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: imgId,
      },
    });

    // Delete old image
    if (user?.image) {
      try {
        await fs.unlink(`./public/user/profilepicture/${user.image}`);
      } catch (error) {
        console.error("Failed to delete old profile picture:", error);
      }
    }

    revalidatePath("/", "layout");

    return {
      isSuccess: true,
      message: "Profile picture updated successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      isSuccess: false,
      message: "Something went wrong!",
    };
  }
};

export default uploadProfilePicture;
