"use client";

import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
} from "@livekit/components-react";

import "@livekit/components-styles";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import { isStreamer } from "@/lib/isStreamer";

export default function LivePage() {
  const { data: session } =
    useSession();

  /* 🔥 STREAMER ROLE CHECK */
  const canStream =
    isStreamer(session?.user);

  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    permissionsGranted,
    setPermissionsGranted,
  ] = useState(false);

  const room = "main-stream";

  /* 🔥 DISCORD USERNAME */
  const identity = useMemo(() => {
    if (session?.user?.name) {
      return session.user.name;
    }

    return `viewer-${Math.floor(
      Math.random() * 99999
    )}`;
  }, [session]);

  const serverUrl =
    process.env
      .NEXT_PUBLIC_LIVEKIT_URL!;

  useEffect(() => {
    const fetchToken =
      async () => {
        try {
          const res = await fetch(
            `/api/livekit-token?room=${room}&identity=${identity}`
          );

          const data =
            await res.json();

          setToken(data.token);
        } catch (err) {
          console.error(
            "Token fetch failed:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchToken();
  }, [identity]);

  /* 🔥 ENABLE CAMERA + MIC */
  const enableMedia =
    async () => {
      try {
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

        setPermissionsGranted(
          true
        );
      } catch (err) {
        console.error(err);

        alert(
          "Camera or microphone access denied."
        );
      }
    };

  if (loading) {
    return (
      <main
        style={loadingStyle}
      >
        Connecting...
      </main>
    );
  }

  if (!token) {
    return (
      <main
        style={loadingStyle}
      >
        Failed to connect.
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "20px",
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              marginBottom: "6px",
            }}
          >
            LIVE STREAM
          </h1>

          <p
            style={{
              opacity: 0.7,
            }}
          >
            {canStream
              ? "Streamer mode enabled"
              : "Viewer mode"}
          </p>
        </div>

        {/* 🔥 STREAMERS ONLY */}
        {canStream && (
          <button
            onClick={enableMedia}
            style={{
              padding:
                "12px 22px",

              borderRadius:
                "14px",

              border: "none",

              background:
                permissionsGranted
                  ? "linear-gradient(135deg, #18c964 0%, #43e97b 100%)"
                  : "linear-gradient(135deg, #ff2d2d 0%, #ff5a5a 100%)",

              color: "#fff",

              fontWeight: 800,

              cursor: "pointer",

              fontSize: "1rem",
            }}
          >
            {permissionsGranted
              ? "🟢 LIVE ENABLED"
              : "🔴 GO LIVE"}
          </button>
        )}
      </div>

      {/* 🔥 PLAYER */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",

          margin: "0 auto",

          borderRadius: "24px",

          overflow: "hidden",

          border:
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45)",

          minHeight: "700px",
        }}
      >
        {token && (
          <LiveKitRoom
            serverUrl={serverUrl}
            token={token}
            connect={true}

            /* 🔥 REMOVE PREJOIN */
           
            /* 🔥 STREAM SETTINGS */
            options={{
              videoCaptureDefaults:
                {
                  resolution: {
                    width: 1280,
                    height: 720,
                  },
                },
            }}

            /* 🔥 ONLY STREAMERS GET MIC/CAM */
            audio={
              canStream &&
              permissionsGranted
            }

            video={
              canStream &&
              permissionsGranted
            }

            data-lk-theme="default"
          >
            <>
              <VideoConference />

              {/* 🔥 STREAMERS ONLY CONTROLS */}
              {canStream &&
                permissionsGranted && (
                  <ControlBar />
                )}
            </>
          </LiveKitRoom>
        )}
      </div>
    </main>
  );
}

const loadingStyle = {
  height: "100vh",

  background: "#000",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "#fff",
};