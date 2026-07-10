import OverviewChart from "@/components/Dashboard/OverviewChart";
import OverviewClient from "@/components/Dashboard/OverviewClient";
import getOverview from "@/server/overview/getOverview";

const page = async () => {
  const overview = await getOverview();

  const chartData = (overview.likesByDay ?? []).map(
    (l: { date: string; count: number }, idx: number) => ({
      date: l.date,
      likes: l.count,
      comments: overview.commentsByDay?.[idx]?.count ?? 0,
    }),
  );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Your posts</p>
          <p className="text-2xl font-semibold">
            {overview.postsCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Total likes</p>
          <p className="text-2xl font-semibold">
            {overview.totalLikes.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Comments</p>
          <p className="text-2xl font-semibold">
            {overview.totalComments.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">Saves</p>
          <p className="text-2xl font-semibold">
            {overview.savesCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium">Activity (last 7 days)</h2>
          <OverviewChart data={chartData} />
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium">Recent activity</h2>
          <OverviewClient
            initial={(overview.recentActivities ?? []).map(
              (a: {
                id: string;
                type: string;
                user: {
                  id: string;
                  name?: string | null;
                  image?: string | null;
                };
                wallpaper: { id: string; title?: string | null };
                text?: string | null;
                createdAt: string | Date;
              }) => ({
                id: a.id,
                type: (a.type as "like" | "comment") ?? "like",
                user: a.user,
                wallpaper: a.wallpaper,
                text: a.text ?? null,
                createdAt: new Date(a.createdAt).toISOString(),
              }),
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
