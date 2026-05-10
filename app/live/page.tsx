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

import LiveChat from "@/components/live/LiveChat";

export default function LivePage() {
  const {
    data: session,
    status,
  } = useSession();

  const [token, setToken] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [isMobile, setIsMobile] =
    useState(false);

  /* 🔥 MOBILE CHECK */

  useEffect(() => {
    const handleResize =
      () => {
        setIsMobile(
          window.innerWidth <
            900
        );
      };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

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

        padding:
          isMobile
            ? "0px"
            : "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1700px",

          margin: "0 auto",

          overflow: "hidden",

          borderRadius:
            isMobile
              ? "0px"
              : "24px",

          border:
            isMobile
              ? "none"
              : "1px solid rgba(255,255,255,0.08)",

          background: "#000",

          minHeight:
            "100vh",
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
          {/* 🔥 TOP BAR */}

          <div
            style={{
              padding:
                isMobile
                  ? "14px"
                  : "20px",

              borderBottom:
                "1px solid rgba(255,255,255,0.08)",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              flexWrap: "wrap",

              gap: "12px",

              background:
                "#0a0a0a",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,

                  fontSize:
                    isMobile
                      ? "1.3rem"
                      : "2rem",

                  fontWeight: 900,
                }}
              >
                🔴 LIVE STREAM
              </h1>

              <p
                style={{
                  marginTop:
                    "6px",

                  opacity: 0.7,

                  fontSize:
                    isMobile
                      ? "0.9rem"
                      : "1rem",
                }}
              >
                {canStream
                  ? "Streamer Mode"
                  : "Viewer Mode"}
              </p>
            </div>

            <StreamerControls
              canStream={
                canStream
              }
            />
          </div>

          {/* 🔥 STREAM + CHAT */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                isMobile
                  ? "1fr"
                  : "1fr 360px",

              minHeight:
                isMobile
                  ? "auto"
                  : "calc(100vh - 120px)",
            }}
          >
            {/* 🎥 STREAM */}

           <div
  style={{
    background:
      "#000",

    overflow:
      "hidden",

    position:
      "relative",

    height:
      isMobile
        ? canStream
          ? "220px"
          : "340px"
        : "100%",

    minHeight:
      isMobile
        ? canStream
          ? "220px"
          : "340px"
        : "100%",

    transition:
      "all 0.25s ease",
  }}
>
  <LivePlayer />
</div>

            {/* 💬 CHAT */}

            <div
              style={{
                background:
                  "#111",

                borderLeft:
                  !isMobile
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",

                borderTop:
                  isMobile
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",

                height:
                  isMobile
                    ? "500px"
                    : "calc(100vh - 120px)",

                overflow:
                  "hidden",
              }}
            >
              <LiveChat />
            </div>
          </div>
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

  fontSize: "1.1rem",
};