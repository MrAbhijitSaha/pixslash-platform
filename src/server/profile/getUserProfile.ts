"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type GetUserProfileProps = {
  userId: string;
};

const getUserProfile = async ({ userId }: GetUserProfileProps) => {
  if (!userId) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  if (session.user.id !== userId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      bio: true,
      image: true,
      name: true,
      mobileNumber: true,
      email: true,
    },
  });

  if (!user) {
    notFound();
  }

  return user;
};

export default getUserProfile;
