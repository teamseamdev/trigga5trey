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

  const [micEnabled, setMicEnabled] =
    useState(true);

  const [
    cameraEnabled,
    setCameraEnabled,
  ] = useState(true);

  const [
    frontCamera,
    setFrontCamera,
  ] = useState(true);

  /* 🔥 START STREAM */

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
          "🔥 STARTING STREAM"
        );

        console.log(
          "🔥 ROOM:",
          room
        );

        console.log(
          "🔥 IDENTITY:",
          room.localParticipant
            .identity
        );

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        console.log(
          "🎤 DEVICES:",
          devices
        );

        /* 🎤 ENABLE MIC */

        await room.localParticipant.setMicrophoneEnabled(
          true
        );

        console.log(
          "✅ MIC ENABLED"
        );

        /* 📷 ENABLE CAMERA */

        await room.localParticipant.setCameraEnabled(
          true
        );

        console.log(
          "✅ CAMERA ENABLED"
        );

        setLive(true);

        setMicEnabled(true);

        setCameraEnabled(true);

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

  /* 🔥 END STREAM */

  const endStream =
    async () => {
      try {
        await room.localParticipant.setMicrophoneEnabled(
          false
        );

        await room.localParticipant.setCameraEnabled(
          false
        );

        setLive(false);

        setMicEnabled(false);

        setCameraEnabled(false);

        console.log(
          "🛑 STREAM ENDED"
        );
      } catch (err) {
        console.error(err);
      }
    };

  /* 🔥 TOGGLE MIC */

  const toggleMic =
    async () => {
      try {
        const next =
          !micEnabled;

        await room.localParticipant.setMicrophoneEnabled(
          next
        );

        setMicEnabled(next);

        console.log(
          next
            ? "🎤 MIC ON"
            : "🔇 MIC OFF"
        );
      } catch (err) {
        console.error(err);
      }
    };

  /* 🔥 TOGGLE CAMERA */

  const toggleCamera =
    async () => {
      try {
        const next =
          !cameraEnabled;

        await room.localParticipant.setCameraEnabled(
          next
        );

        setCameraEnabled(
          next
        );

        console.log(
          next
            ? "📷 CAMERA ON"
            : "📷 CAMERA OFF"
        );
      } catch (err) {
        console.error(err);
      }
    };

  /* 🔥 FLIP CAMERA */

  const flipCamera =
    async () => {
      try {
        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const videoDevices =
          devices.filter(
            (d) =>
              d.kind ===
              "videoinput"
          );

        console.log(
          "📷 VIDEO DEVICES:",
          videoDevices
        );

        if (
          videoDevices.length < 2
        ) {
          alert(
            "No secondary camera found"
          );

          return;
        }

        const nextFront =
          !frontCamera;

        const targetDevice =
          nextFront
            ? videoDevices[0]
            : videoDevices[1];

        console.log(
          "🔄 SWITCHING CAMERA:",
          targetDevice
        );

        await room.switchActiveDevice(
          "videoinput",
          targetDevice.deviceId
        );

        setFrontCamera(
          nextFront
        );

        console.log(
          nextFront
            ? "🤳 FRONT CAMERA"
            : "📷 REAR CAMERA"
        );
      } catch (err) {
        console.error(
          "❌ CAMERA FLIP FAILED",
          err
        );
      }
    };

  if (!canStream) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",

        flexWrap: "wrap",

        gap: "12px",

        alignItems: "center",
      }}
    >
      {/* 🔴 GO LIVE */}

      {!live && (
        <button
          onClick={
            startStream
          }
          disabled={
            loading
          }
          style={{
            ...buttonStyle,

            background:
              "#ff2d2d",
          }}
        >
          {loading
            ? "Starting..."
            : "🔴 GO LIVE"}
        </button>
      )}

      {/* 🛑 END */}

      {live && (
        <>
          <button
            onClick={
              endStream
            }
            style={{
              ...buttonStyle,

              background:
                "#444",
            }}
          >
            🛑 END
          </button>

          {/* 🎤 MIC */}

          <button
            onClick={
              toggleMic
            }
            style={{
              ...buttonStyle,

              background:
                micEnabled
                  ? "#18c964"
                  : "#ff2d2d",
            }}
          >
            {micEnabled
              ? "🎤 MIC ON"
              : "🔇 MIC OFF"}
          </button>

          {/* 📷 CAMERA */}

          <button
            onClick={
              toggleCamera
            }
            style={{
              ...buttonStyle,

              background:
                cameraEnabled
                  ? "#18c964"
                  : "#ff2d2d",
            }}
          >
            {cameraEnabled
              ? "📷 CAMERA ON"
              : "📷 CAMERA OFF"}
          </button>

          {/* 🔄 FLIP CAMERA */}

          <button
            onClick={
              flipCamera
            }
            style={{
              ...buttonStyle,

              background:
                "#0070f3",
            }}
          >
            🔄 FLIP
          </button>
        </>
      )}
    </div>
  );
}

/* 🔥 BUTTON STYLE */

const buttonStyle = {
  padding: "14px 22px",

  borderRadius: "14px",

  border: "none",

  color: "#fff",

  fontWeight: 800,

  fontSize: "1rem",

  cursor: "pointer",
} as const;