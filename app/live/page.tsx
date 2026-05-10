"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  ControlBar,
  useLocalParticipant,
} from "@livekit/components-react";

import {
  Track,
} from "livekit-client";

import "@livekit/components-styles";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import { isStreamer } from "@/lib/isStreamer";

/* 🔥 STREAM PUBLISHER */

function StreamPublisher({
  enabled,
}: {
  enabled: boolean;
}) {
  const {
    localParticipant,
  } = useLocalParticipant();

  const [started, setStarted] =
    useState(false);

  useEffect(() => {
    const start =
      async () => {
        if (!enabled) return;

        if (started) return;

        try {
          console.log(
            "🔥 STARTING STREAM"
          );

          const videoTracks =
            await localParticipant.createTracks({
              video: true,
            });

          const audioTracks =
            await localParticipant.createTracks({
              audio: true,
            });

          for (const track of [
            ...videoTracks,
            ...audioTracks,
          ]) {
            await localParticipant.publishTrack(
              track
            );

            console.log(
              "✅ TRACK PUBLISHED:",
              track.kind
            );
          }

          setStarted(true);

          console.log(
            "🚀 STREAM LIVE"
          );
        } catch (err) {
          console.error(
            "❌ Publish failed:",
            err
          );
        }
      };

    start();
  }, [
    enabled,
    localParticipant,
    started,
  ]);

  return null;
}

/* 🔥 STREAM VIEW */

function StreamView() {
  const tracks = useTracks([
    {
      source:
        Track.Source.Camera,

      withPlaceholder: false,
    },
  ]);

  console.log(
    "🎥 TRACKS:",
    tracks
  );

  const streamerTrack =
    tracks.find((track: any) =>
      track.participant?.identity?.startsWith(
        "streamer-"
      )
    );

  if (!streamerTrack) {
    return (
      <div
        style={{
          height: "700px",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          color: "#fff",

          fontSize: "1.2rem",

          background: "#000",
        }}
      >
        Stream is offline.
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",

        width: "100%",

        height: "700px",

        background: "#000",
      }}
    >
      <VideoTrack
        trackRef={
          streamerTrack as any
        }
      />

      <RoomAudioRenderer />
    </div>
  );
}

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
      Math.random() * 99999
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
            room,
            identity,
            canPublish:
              canStream,
          });

          const res = await fetch(
            `/api/livekit-token?room=${room}&identity=${identity}&canPublish=${canStream}`
          );

          const data =
            await res.json();

          console.log(
            "✅ TOKEN RECEIVED"
          );

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
  }, [identity, canStream]);

  /* 🔥 ENABLE CAMERA + MIC */

  const enableMedia =
    async () => {
      if (!canStream) return;

      try {
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

        console.log(
          "🎤 CAMERA/MIC GRANTED"
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

          margin:
            "0 auto 20px",

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
            onClick={
              enableMedia
            }
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

          borderRadius:
            "24px",

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
            serverUrl={
              serverUrl
            }

            token={token}

            connect={true}

            options={{
              adaptiveStream: true,

              dynacast: true,

              videoCaptureDefaults:
                {
                  resolution:
                    {
                      width: 1280,
                      height: 720,
                    },
                },
            }}

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
              {/* 🔥 PUBLISH TRACKS */}

              <StreamPublisher
                enabled={
                  canStream &&
                  permissionsGranted
                }
              />

              {/* 🔥 STREAM VIEW */}

              <StreamView />

              {/* 🔥 ONLY STREAMERS SEE CONTROLS */}

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