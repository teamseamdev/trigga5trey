"use client";

import { useEffect } from "react";

export default function SyncRunner() {
  useEffect(() => {
    const runSync = async () => {
      try {
        await Promise.all([
          fetch("/api/live-check"),
          fetch("/api/discord-sync"),
          fetch("/api/scanner-sync"),
        ]);

        console.log("✅ Sync complete");
      } catch (err) {
        console.error("❌ Sync error:", err);
      }
    };

    /* 🔥 RUN IMMEDIATELY */
    runSync();

    /* 🔥 RUN EVERY 60 SECONDS */
    const interval = setInterval(runSync, 15000);

    return () => clearInterval(interval);
  }, []);

  return null;
}