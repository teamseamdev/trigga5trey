"use client";

import {
  LiveKitRoom,
  VideoConference,
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

  const canStream =
    isStreamer(session?.user);

  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const room = "main-stream";

  /* 🔥 STABLE IDENTITY */
  const identity = useMemo(() => {
    return canStream
      ? `streamer-${
          session?.user?.name ||
          "creator"
        }`
      : `viewer-${Math.floor(
          Math.random() * 99999
        )}`;
  }, [canStream, session]);

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

  if (loading) {
    return (
      <main
        style={{
          height: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Connecting...
      </main>
    );
  }

  if (!token) {
    return (
      <main
        style={{
          height: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
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

        {canStream && (
          <button
            style={{
              padding:
                "12px 22px",
              borderRadius:
                "14px",
              border: "none",
              background:
                "linear-gradient(135deg, #ff2d2d 0%, #ff5a5a 100%)",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            🔴 GO LIVE
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
        }}
      >
        <LiveKitRoom
          serverUrl={serverUrl}
          token={token}
          connect={true}
          audio={canStream}
          video={canStream}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </main>
  );
}