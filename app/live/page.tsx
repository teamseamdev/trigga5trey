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

export default function LivePage() {
  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const room = "main-stream";

  const identity = useMemo(() => {
    return `viewer-${Math.floor(
      Math.random() * 99999
    )}`;
  }, []);

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
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 900,
          }}
        >
          LIVE STREAM
        </h1>
      </div>

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
            audio={true}
            video={true}
            data-lk-theme="default"
          >
            <VideoConference />
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