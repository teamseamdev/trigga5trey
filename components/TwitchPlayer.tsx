"use client";

import { useEffect, useState } from "react";

export default function TwitchPlayer({ channel }: { channel: string }) {
  const [parent, setParent] = useState("localhost");

  useEffect(() => {
    setParent(window.location.hostname);
  }, []);

  return (
    <iframe
      src={`https://player.twitch.tv/?channel=${channel}&parent=${parent}`}
      height="100%"
      width="100%"
      allowFullScreen
      style={{ border: "none" }}
    />
  );
}