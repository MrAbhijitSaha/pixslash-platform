"use client";

import React from "react";

type Activity = {
  id: string;
  type: "like" | "comment";
  user: { id: string; name?: string | null; image?: string | null };
  wallpaper: { id: string; title?: string | null };
  text?: string | null;
  createdAt: string;
};

export default function OverviewClient({ initial }: { initial: Activity[] }) {
  const [activities, setActivities] = React.useState<Activity[]>(initial || []);

  React.useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/overview");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setActivities(json.recentActivities || []);
      } catch (e) {
        // noop
      }
    };

    const id = setInterval(fetchLatest, 10000);
    // initial fetch
    fetchLatest();
    return () => {
      mounted = false;
      clearInterval(id);
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
            <img
              src={a.user.image || `/wallpapers/posts/default-avatar.png`}
              alt={a.user.name || "user"}
              className="h-8 w-8 rounded-full object-cover"
            />
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
