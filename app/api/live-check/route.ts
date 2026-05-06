import { NextResponse } from "next/server";
import { isTwitchLive } from "@/lib/twitch";

let wasLive = false;

export async function GET() {
  const isLive = await isTwitchLive("trigga5trey");

  if (isLive && !wasLive) {
    wasLive = true;

    // 🔥 trigger broadcast
    await fetch(process.env.NEXT_PUBLIC_SITE_URL + "/api/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "🔴 LIVE NOW",
        body: "Trigga5Trey just went live 🚀",
      }),
    });
  }

  if (!isLive) {
    wasLive = false;
  }

  return NextResponse.json({ live: isLive });
}