import { NextResponse } from "next/server";

import {
  AccessToken,
} from "livekit-server-sdk";

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const room =
      searchParams.get("room");

    const identity =
      searchParams.get(
        "identity"
      );

    if (!room || !identity) {
      return NextResponse.json(
        {
          error:
            "Missing room or identity",
        },
        { status: 400 }
      );
    }

    const apiKey =
      process.env
        .LIVEKIT_API_KEY;

    const apiSecret =
      process.env
        .LIVEKIT_API_SECRET;

    if (
      !apiKey ||
      !apiSecret
    ) {
      return NextResponse.json(
        {
          error:
            "Missing LiveKit env vars",
        },
        { status: 500 }
      );
    }

    /* 🔥 CREATE TOKEN */
    const at =
      new AccessToken(
        apiKey,
        apiSecret,
        {
          identity,
        }
      );

    /* 🔥 ROOM GRANTS */
    at.addGrant({
      roomJoin: true,
      room,

      canPublish: true,
      canSubscribe: true,

      canPublishData: true,
    });

    /* 🔥 JWT */
    const token =
      await at.toJwt();

    return NextResponse.json({
      token,
    });
  } catch (err) {
    console.error(
      "LIVEKIT TOKEN ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate token",
      },
      { status: 500 }
    );
  }
}