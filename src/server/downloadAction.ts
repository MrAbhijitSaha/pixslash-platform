"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const downloadWallpaper = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Please login first.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

export default downloadWallpaper;
