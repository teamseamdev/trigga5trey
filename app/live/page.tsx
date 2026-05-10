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

import {
  useSession,
} from "next-auth/react";

import { isStreamer } from "@/lib/isStreamer";

import LivePlayer from "@/components/live/LivePlayer";

import StreamerControls from "@/components/live/StreamerControls";

export default function LivePage() {
  const {
    data: session,
    status,
  } = useSession();

  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* 🔥 STREAMER CHECK */

  const canStream =
    isStreamer(session?.user);

  /* 🔥 ROOM */

  const roomName =
    "main-stream";

  /* 🔥 IDENTITY */

  const identity =
    useMemo(() => {
      if (
        canStream &&
        session?.user?.name
      ) {
        return `streamer-${session.user.name}`;
      }

      if (
        session?.user?.name
      ) {
        return session.user.name;
      }

      return `viewer-${Math.floor(
        Math.random() *
          999999
      )}`;
    }, [session, canStream]);

  /* 🔥 DEBUG */

  console.log(
    "FULL SESSION:",
    session
  );

  console.log(
    "STATUS:",
    status
  );

  console.log(
    "CAN STREAM:",
    canStream
  );

  console.log(
    "IDENTITY:",
    identity
  );

  /* 🔥 LIVEKIT URL */

  const serverUrl =
    process.env
      .NEXT_PUBLIC_LIVEKIT_URL!;

  /* 🔥 TOKEN FETCH */

  useEffect(() => {
    const fetchToken =
      async () => {
        try {
          console.log(
            "🔑 FETCHING TOKEN"
          );

          const res =
            await fetch(
              `/api/livekit-token?room=${roomName}&identity=${identity}&canPublish=${canStream}`
            );

          const data =
            await res.json();

          console.log(
            "✅ TOKEN READY"
          );

          setToken(
            data.token
          );
        } catch (err) {
          console.error(
            "❌ TOKEN ERROR",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    if (
      status !==
      "authenticated"
    ) {
      return;
    }

    if (!identity) {
      return;
    }

    fetchToken();
  }, [
    identity,
    roomName,
    canStream,
    status,
  ]);

  /* 🔥 LOADING AUTH */

  if (
    status === "loading"
  ) {
    return (
      <main
        style={loadingStyle}
      >
        Loading session...
      </main>
    );
  }

  /* 🔥 LOADING TOKEN */

  if (loading) {
    return (
      <main
        style={loadingStyle}
      >
        Connecting...
      </main>
    );
  }

  /* 🔥 FAILED */

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

          audio={false}

          video={false}

          options={{
            adaptiveStream:
              true,

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

  justifyContent:
    "center",

  background: "#000",

  color: "#fff",
};