"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcnui/avatar";

type Activity = {
  id: string;
  type: "like" | "comment";
  user: { id: string; name?: string | null; image?: string | null };
  wallpaper: { id: string; title?: string | null };
  text?: string | null;
  createdAt: string;
};

export default function OverviewClient({ initial }: { initial: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initial || []);

  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/overview/recent-activities");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setActivities(json.recentActivities || []);
      } catch (e) {
        console.log(e);
      }
    };

    // initial fetch
    fetchLatest();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-2">
      {activities.length === 0 ?
        <p className="text-muted-foreground text-sm">No recent activity</p>
      : activities.map((a) => (
          <div
            key={a.id}
            className="flex items-start gap-3">
            {
              <Avatar size="lg">
                <AvatarImage
                  src={a?.user?.image || ""}
                  alt={a?.user?.name || "User"}
                />
                <AvatarFallback>
                  {a?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            }

            <div>
              <p className="text-sm">
                <span className="font-medium">{a.user.name || "Someone"}</span>{" "}
                {a.type === "like" ? "liked" : "commented on"}{" "}
                <span className="font-medium">
                  {a.wallpaper?.title || "your post"}
                </span>
              </p>
              {a.text ?
                <p className="text-muted-foreground text-xs">{a.text}</p>
              : null}
              <p className="text-muted-foreground text-xs">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      }
    </div>
  );
}
