"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { profileInformationSchema } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const upadteProfileDetails = async (formData: FormData) => {
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

    const parseInput = profileInformationSchema.safeParse({
      name: formData.get("name"),
      mobileNumber: formData.get("mobileNumber"),
      bio: formData.get("bio"),
    });

    if (!parseInput.success) {
      return {
        isSuccess: false,
        message: parseInput.error.issues[0].message,
      };
    }

    const { name, bio, mobileNumber } = parseInput.data;

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        bio: bio || null,
        mobileNumber: mobileNumber || null,
      },
    });

    revalidatePath(`/profile/${session.user.id}`);

    return {
      isSuccess: true,
      message: "Your profile has been updated successfully.",
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      message: "Something went wrong ! Please try again ",
    };
  }
};

export default upadteProfileDetails;
