import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const identity =
      searchParams.get("identity");

    const room =
      searchParams.get("room");

    if (!identity || !room) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.LIVEKIT_API_KEY;

    const apiSecret =
      process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing LiveKit env vars" },
        { status: 500 }
      );
    }

    const at = new AccessToken(
      apiKey,
      apiSecret,
      {
        identity,
      }
    );

    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

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
      { error: "Failed" },
      { status: 500 }
    );
  }
}