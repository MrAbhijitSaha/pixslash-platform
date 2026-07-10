import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.session.userId ?? session?.user?.id;

    if (!userId) {
      return NextResponse.json({ recentActivities: [] });
    }

    const recentLikes = await prisma.like.findMany({
      where: { wallpaper: { userId } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        wallpaper: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentComments = await prisma.comment.findMany({
      where: { wallpaper: { userId } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        wallpaper: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentActivities = [
      ...recentLikes.map((l) => ({
        type: "like",
        id: `like-${l.userId}-${l.wallpaperId}-${new Date(l.createdAt).toISOString()}`,
        user: l.user,
        wallpaper: l.wallpaper,
        createdAt: l.createdAt,
      })),
      ...recentComments.map((c) => ({
        type: "comment",
        id: `comment-${c.userId}-${c.wallpaperId}-${new Date(c.createdAt).toISOString()}`,
        user: c.user,
        wallpaper: c.wallpaper,
        text: c.opinion,
        createdAt: c.createdAt,
      })),
    ]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 10);

    return NextResponse.json({ recentActivities });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load recent activities" },
      { status: 500 },
    );
  }
}
