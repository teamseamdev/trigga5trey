"use client";

import {
  useTracks,
  VideoTrack,
  RoomAudioRenderer,
} from "@livekit/components-react";

import { Track } from "livekit-client";

export default function LivePlayer() {
  const tracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: false,
    },
  ]);

  console.log(
    "🎥 LIVE TRACKS:",
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
          width: "100%",
          height: "100%",
          minHeight: "700px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "#000",

          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: 700,
        }}
      >
        Stream is offline
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",

        width: "100%",
        height: "100%",
        minHeight: "700px",

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