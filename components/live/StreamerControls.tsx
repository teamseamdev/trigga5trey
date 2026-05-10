"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocalParticipant,
} from "@livekit/components-react";

export default function StreamerControls({
  canStream,
}: {
  canStream: boolean;
}) {
  const {
    localParticipant,
  } = useLocalParticipant();

  const [live, setLive] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    console.log(
      "🎤 STREAMER READY:",
      localParticipant?.identity
    );
  }, [localParticipant]);

  const startStream =
    async () => {
      if (!canStream) {
        alert(
          "You do not have streamer permissions."
        );

        return;
      }

      try {
        setLoading(true);

        console.log(
          "🔥 STARTING STREAM"
        );

        await localParticipant.setMicrophoneEnabled(
          true
        );

        console.log(
          "✅ MIC ENABLED"
        );

        await localParticipant.setCameraEnabled(
          true
        );

        console.log(
          "✅ CAMERA ENABLED"
        );

        setLive(true);

        console.log(
          "🚀 STREAM LIVE"
        );
      } catch (err: any) {
        console.error(
          "❌ STREAM FAILED",
          err
        );

        console.log(
          "ERROR:",
          err?.message
        );

        alert(
          err?.message ||
            "Failed to start stream"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!canStream) {
    return null;
  }

  return (
    <button
      onClick={startStream}
      disabled={
        loading || live
      }
      style={{
        padding:
          "14px 22px",

        borderRadius:
          "14px",

        border: "none",

        background: live
          ? "#18c964"
          : "#ff2d2d",

        color: "#fff",

        fontWeight: 800,

        fontSize: "1rem",

        cursor: "pointer",
      }}
    >
      {loading
        ? "Starting..."
        : live
        ? "🟢 LIVE"
        : "🔴 GO LIVE"}
    </button>
  );
}