import getOverview from "@/server/overview/getOverview";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getOverview();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load overview" },
      { status: 500 },
    );
  }
}
