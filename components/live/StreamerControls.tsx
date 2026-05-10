"use client";

import {
  useEffect,
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
    useState(false);

  const [
    cameraEnabled,
    setCameraEnabled,
  ] = useState(false);

  const [
    usingFrontCamera,
    setUsingFrontCamera,
  ] = useState(true);

  const [
    participantCount,
    setParticipantCount,
  ] = useState(1);

  /* 🔥 WATCH VIEWER COUNT */

  useEffect(() => {
    const updateCount =
      () => {
        setParticipantCount(
          room.numParticipants
        );
      };

    updateCount();

    room.on(
      "participantConnected",
      updateCount
    );

    room.on(
      "participantDisconnected",
      updateCount
    );

    return () => {
      room.off(
        "participantConnected",
        updateCount
      );

      room.off(
        "participantDisconnected",
        updateCount
      );
    };
  }, [room]);

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

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const hasCamera =
          devices.some(
            (d) =>
              d.kind ===
              "videoinput"
          );

        const hasMic =
          devices.some(
            (d) =>
              d.kind ===
              "audioinput"
          );

        /* 🎤 MIC */

        if (hasMic) {
          await room.localParticipant.setMicrophoneEnabled(
            true
          );

          setMicEnabled(
            true
          );

          console.log(
            "✅ MIC ENABLED"
          );
        }

        /* 📸 CAMERA */

        if (hasCamera) {
          await room.localParticipant.setCameraEnabled(
            true
          );

          setCameraEnabled(
            true
          );

          console.log(
            "✅ CAMERA ENABLED"
          );
        }

        setLive(true);

        console.log(
          "🚀 STREAM LIVE"
        );
      } catch (err: any) {
        console.error(
          "❌ STREAM FAILED",
          err
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

        setMicEnabled(
          false
        );

        setCameraEnabled(
          false
        );

        setLive(false);

        console.log(
          "🛑 STREAM ENDED"
        );
      } catch (err) {
        console.error(
          err
        );
      }
    };

  /* 🔥 TOGGLE MIC */

  const toggleMic =
    async () => {
      const newState =
        !micEnabled;

      await room.localParticipant.setMicrophoneEnabled(
        newState
      );

      setMicEnabled(
        newState
      );
    };

  /* 🔥 TOGGLE CAMERA */

  const toggleCamera =
    async () => {
      const newState =
        !cameraEnabled;

      await room.localParticipant.setCameraEnabled(
        newState
      );

      setCameraEnabled(
        newState
      );
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

        if (
          videoDevices.length <
          2
        ) {
          alert(
            "No second camera found"
          );

          return;
        }

        const targetDevice =
          usingFrontCamera
            ? videoDevices[1]
            : videoDevices[0];

        await room.localParticipant.setCameraEnabled(
          false
        );

        await room.localParticipant.setCameraEnabled(
          true,
          {
            deviceId:
              targetDevice.deviceId,
          }
        );

        setUsingFrontCamera(
          !usingFrontCamera
        );

        console.log(
          "🔄 CAMERA FLIPPED"
        );
      } catch (err) {
        console.error(
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

        flexDirection:
          "column",

        gap: "12px",
      }}
    >
      {/* 🔥 VIEWER COUNT */}

      <div
        style={{
          fontWeight: 700,

          opacity: 0.8,

          fontSize: "0.95rem",
        }}
      >
        👁{" "}
        {participantCount}{" "}
        watching
      </div>

      {/* 🔥 BUTTON ROW */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(4, 1fr)",

          gap: "10px",

          width: "100%",
        }}
      >
        {/* 🔴 END */}

        <button
          onClick={
            endStream
          }
          disabled={!live}
          style={{
            padding:
              "12px 10px",

            borderRadius:
              "12px",

            border: "none",

            background:
              "#3a3a3a",

            color: "#fff",

            fontWeight: 800,

            fontSize:
              "0.95rem",

            cursor:
              "pointer",
          }}
        >
          🛑 END
        </button>

        {/* 🎤 MIC */}

        <button
          onClick={
            toggleMic
          }
          disabled={!live}
          style={{
            padding:
              "12px 10px",

            borderRadius:
              "12px",

            border: "none",

            background:
              micEnabled
                ? "#18c964"
                : "#ff2d2d",

            color: "#fff",

            fontWeight: 800,

            fontSize:
              "0.95rem",

            cursor:
              "pointer",
          }}
        >
          🎤{" "}
          {micEnabled
            ? "ON"
            : "OFF"}
        </button>

        {/* 📸 CAMERA */}

        <button
          onClick={
            toggleCamera
          }
          disabled={!live}
          style={{
            padding:
              "12px 10px",

            borderRadius:
              "12px",

            border: "none",

            background:
              cameraEnabled
                ? "#18c964"
                : "#ff2d2d",

            color: "#fff",

            fontWeight: 800,

            fontSize:
              "0.95rem",

            cursor:
              "pointer",
          }}
        >
          📸{" "}
          {cameraEnabled
            ? "ON"
            : "OFF"}
        </button>

        {/* 🔄 FLIP */}

        <button
          onClick={
            flipCamera
          }
          disabled={
            !live ||
            !cameraEnabled
          }
          style={{
            padding:
              "12px 10px",

            borderRadius:
              "12px",

            border: "none",

            background:
              "#2d6cff",

            color: "#fff",

            fontWeight: 800,

            fontSize:
              "0.95rem",

            cursor:
              "pointer",
          }}
        >
          🔄 FLIP
        </button>
      </div>

      {/* 🔥 GO LIVE */}

      {!live && (
        <button
          onClick={
            startStream
          }
          disabled={loading}
          style={{
            padding:
              "14px",

            borderRadius:
              "14px",

            border: "none",

            background:
              "#ff2d2d",

            color: "#fff",

            fontWeight: 900,

            fontSize:
              "1rem",

            cursor:
              "pointer",
          }}
        >
          {loading
            ? "Starting..."
            : "🔴 GO LIVE"}
        </button>
      )}
    </div>
  );
}