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
      if (!canStream) return;

      try {
        setLoading(true);

        console.log(
          "🔥 REQUESTING MEDIA"
        );

        await localParticipant.setCameraEnabled(
          true
        );

        console.log(
          "✅ CAMERA ENABLED"
        );

        await localParticipant.setMicrophoneEnabled(
          true
        );

        console.log(
          "✅ MICROPHONE ENABLED"
        );

        setLive(true);

        console.log(
          "🚀 STREAM IS LIVE"
        );
      } catch (err: any) {
        console.error(
          "❌ STREAM FAILED",
          err
        );

        console.log(
          "ERROR STRING:",
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
        live || loading
      }
      style={{
        padding:
          "14px 22px",

        borderRadius:
          "14px",

        border: "none",

        background: live
          ? "linear-gradient(135deg, #18c964 0%, #43e97b 100%)"
          : "linear-gradient(135deg, #ff2d2d 0%, #ff5a5a 100%)",

        color: "#fff",

        fontWeight: 800,

        fontSize: "1rem",

        cursor: "pointer",

        opacity:
          loading ? 0.7 : 1,
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