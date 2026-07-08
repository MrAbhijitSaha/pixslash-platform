"use client";

import { ChartContainer } from "@/components/shadcnui/chart";
import * as Recharts from "recharts";

type ChartPoint = {
  date: string;
  likes: number;
  comments: number;
};

export default function OverviewChart({ data }: { data: ChartPoint[] }) {
  return (
    <ChartContainer
      config={{
        likes: { label: "Likes", color: "#06b6d4" },
        comments: { label: "Comments", color: "#7c3aed" },
      }}>
      <Recharts.LineChart
        data={data}
        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="date" />
        <Recharts.YAxis />
        <Recharts.Tooltip />
        <Recharts.Legend />
        <Recharts.Line
          type="monotone"
          dataKey="likes"
          stroke="var(--color-likes)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Recharts.Line
          type="monotone"
          dataKey="comments"
          stroke="var(--color-comments)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </Recharts.LineChart>
    </ChartContainer>
  );
}
