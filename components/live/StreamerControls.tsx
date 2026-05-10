"use client";

import {
  useState,
} from "react";

import {
  useRoomContext,
} from "@livekit/components-react";

export default function StreamerControls({
  canStream,
}: {
  canStream: boolean;
}) {
  const room =
    useRoomContext();

  const [loading, setLoading] =
    useState(false);

  const [live, setLive] =
    useState(false);

  const startStream =
    async () => {
      if (!canStream) {
        alert(
          "No streamer permissions"
        );

        return;
      }

      try {
        setLoading(true);

        console.log(
          "🔥 ROOM:",
          room
        );

        console.log(
          "🔥 LOCAL PARTICIPANT:",
          room.localParticipant
        );

        console.log(
          "🔥 IDENTITY:",
          room.localParticipant.identity
        );

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        console.log(
          "🎤 DEVICES:",
          devices
        );

        await room.localParticipant.setMicrophoneEnabled(
          true
        );

        console.log(
          "✅ MIC ENABLED"
        );

        await room.localParticipant.setCameraEnabled(
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