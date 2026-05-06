"use client";

import { useEffect, useState } from "react";

export default function TwitchPlayer({
  channel,
}: {
  channel: string;
}) {
  const [parent, setParent] = useState("localhost");

  useEffect(() => {
    setParent(window.location.hostname);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false`}
        height="100%"
        width="100%"
        allowFullScreen
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))",
        }}
      />
    </div>
  );
}