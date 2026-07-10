"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

const getOverview = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.session.userId ?? session?.user?.id;

  if (!userId) {
    return {
      postsCount: 0,
      totalLikes: 0,
      totalComments: 0,
      savesCount: 0,
      likesByDay: [],
      commentsByDay: [],
      recentActivities: [],
    };
  }

  const [postsCount, totalLikes, totalComments, savesCount] = await Promise.all(
    [
      prisma.wallpaper.count({ where: { userId } }),
      prisma.like.count({ where: { wallpaper: { userId } } }),
      prisma.comment.count({ where: { wallpaper: { userId } } }),
      prisma.savedPost.count({ where: { wallpaper: { userId } } }),
    ],
  );

  // recent likes
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

  // merge activities
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

  // timeseries for last 7 days
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // format local date label (YYYY-MM-DD) to avoid UTC shift when using toISOString()
  const formatLocalDate = (dt: Date) => {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const likes = await prisma.like.findMany({
    where: {
      wallpaper: { userId },
      createdAt: { gte: days[0] },
    },
    select: { createdAt: true },
  });

  const comments = await prisma.comment.findMany({
    where: {
      wallpaper: { userId },
      createdAt: { gte: days[0] },
    },
    select: { createdAt: true },
  });

  const likesByDay = days.map((d) => {
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = likes.filter(
      (l) => new Date(l.createdAt) >= d && new Date(l.createdAt) < next,
    ).length;
    return { date: formatLocalDate(d), count };
  });

  const commentsByDay = days.map((d) => {
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const count = comments.filter(
      (c) => new Date(c.createdAt) >= d && new Date(c.createdAt) < next,
    ).length;
    return { date: formatLocalDate(d), count };
  });

  return {
    postsCount,
    totalLikes,
    totalComments,
    savesCount,
    likesByDay,
    commentsByDay,
    recentActivities,
  };
};

export default getOverview;
