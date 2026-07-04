"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { wallpaperUploadSchema } from "@/lib/zodSchema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import sharp from "sharp";
import slugify from "slugify";

const wallpaperUploadAction = async (formData: FormData) => {
  let filePath = "";
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        isSuccess: false,
        message: "Please login first.",
      };
    }

    const image = formData.get("image") as File;

    if (!image) {
      return {
        isSuccess: false,
        message: "Please select an image.",
      };
    }

    let rawTags: unknown = [];

    try {
      rawTags = JSON.parse(String(formData.get("tags") ?? "[]"));
    } catch {
      return { isSuccess: false, message: "Invalid tags payload." };
    }

    const parsedInput = wallpaperUploadSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      tags: rawTags,
    });

    if (!parsedInput.success) {
      return {
        isSuccess: false,
        message: parsedInput.error.issues[0]?.message ?? "Invalid upload data.",
      };
    }

    const { title, description, category: categoryId, tags } = parsedInput.data;

    const uniqueTags = [...new Set(tags)];

    // File size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (image.size > MAX_FILE_SIZE) {
      return {
        isSuccess: false,
        message: "Image size must be less than 10MB.",
      };
    }

    // Convert File -> Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Get image all information like hight width
    const metadata = await sharp(buffer).metadata();

    // image formats
    const allowedFormats = ["png", "jpeg", "webp"];

    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      return {
        isSuccess: false,
        message: "Only PNG, JPG, JPEG, and WEBP images are allowed.",
      };
    }

    // Check category
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return {
        isSuccess: false,
        message: "Invalid category.",
      };
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        id: {
          in: uniqueTags,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingTags.length !== uniqueTags.length) {
      return {
        isSuccess: false,
        message: "Invalid tags.",
      };
    }

    // Image name
    const extension = metadata.format === "jpeg" ? "jpg" : metadata.format;

    const imgId = `${randomUUID().slice(0, 8)}.${extension}`;

    // original image file path
    filePath = `./public/wallpapers/posts/${imgId}`;

    // Save original image
    await sharp(buffer).toFile(filePath);

    // convert tittle in to slug
    const slug = `${slugify(title, {
      lower: true,
      strict: true,
    })}-${randomUUID().slice(0, 6)}`;

    // Create wallpaper
    await prisma.wallpaper.create({
      data: {
        title,

        description,

        slug,

        imageUrl: imgId,

        categoryId,

        userId: session.user.id,

        width: metadata.width,

        height: metadata.height,

        fileSize: image.size,

        format: metadata.format,

        wallpaperTags: {
          create: uniqueTags.map((tagId) => ({
            tagId,
          })),
        },
      },
    });

    revalidatePath("/");

    return {
      isSuccess: true,
      message: "Wallpaper uploaded successfully.",
    };
  } catch (error) {
    console.error(error);

    // Delete original image if DB failed
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    return {
      isSuccess: false,
      message: "Something Went Wrong!",
    };
  }
};

export default wallpaperUploadAction;
