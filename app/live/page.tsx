"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LiveKitRoom,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { useSession } from "next-auth/react";

import { isStreamer } from "@/lib/isStreamer";

import LivePlayer from "@/components/live/LivePlayer";

import StreamerControls from "@/components/live/StreamerControls";

export default function LivePage() {
  const { data: session } =
    useSession();

  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const canStream =
    isStreamer(session?.user);

  const roomName =
    "main-stream";

  const identity = useMemo(() => {
    if (
      canStream &&
      session?.user?.name
    ) {
      return `streamer-${session.user.name}`;
    }

    if (session?.user?.name) {
      return session.user.name;
    }

    return `viewer-${Math.floor(
      Math.random() * 999999
    )}`;
  }, [session, canStream]);

  const serverUrl =
    process.env
      .NEXT_PUBLIC_LIVEKIT_URL!;

  useEffect(() => {
    const fetchToken =
      async () => {
        try {
          console.log(
            "🔑 FETCHING TOKEN"
          );

          console.log({
            identity,
            roomName,
            canPublish:
              canStream,
          });

          const res = await fetch(
            `/api/livekit-token?room=${roomName}&identity=${identity}&canPublish=${canStream}`
          );

          const data =
            await res.json();

          console.log(
            "✅ TOKEN READY"
          );

          setToken(data.token);
        } catch (err) {
          console.error(
            "❌ TOKEN ERROR",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchToken();
  }, [
    identity,
    roomName,
    canStream,
  ]);

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
      {/* HEADER */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          gap: "20px",

          marginBottom: "20px",

          maxWidth: "1400px",

          margin:
            "0 auto 20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",

              fontWeight: 900,
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
              ? "Streamer Mode"
              : "Viewer Mode"}
          </p>
        </div>
      </div>

      {/* LIVEKIT */}

      <div
        style={{
          maxWidth: "1400px",

          margin: "0 auto",

          overflow: "hidden",

          borderRadius:
            "24px",

          border:
            "1px solid rgba(255,255,255,0.08)",

          background: "#000",
        }}
      >
        <LiveKitRoom
          serverUrl={
            serverUrl
          }

          token={token}

          connect={true}

          audio={
            canStream
          }

          video={
            canStream
          }

          options={{
            adaptiveStream: true,

            dynacast: true,
          }}

          onConnected={() => {
            console.log(
              "✅ CONNECTED TO LIVEKIT"
            );
          }}

          onDisconnected={() => {
            console.log(
              "❌ DISCONNECTED"
            );
          }}

          data-lk-theme="default"
        >
          {/* STREAMER BUTTONS */}

          <div
            style={{
              padding: "20px",
            }}
          >
            <StreamerControls
              canStream={
                canStream
              }
            />
          </div>

          {/* LIVE PLAYER */}

          <LivePlayer />
        </LiveKitRoom>
      </div>
    </main>
  );
}

const loadingStyle = {
  minHeight: "100vh",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  background: "#000",

  color: "#fff",
};