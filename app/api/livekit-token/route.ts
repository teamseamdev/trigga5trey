import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const room = searchParams.get("room");
    const identity = searchParams.get("identity");
    const canPublish =
      searchParams.get("canPublish") === "true";

    if (!room || !identity) {
      return NextResponse.json(
        {
          error: "Missing room or identity",
        },
        {
          status: 400,
        }
      );
    }

    console.log("LIVEKIT TOKEN REQUEST");
    console.log({
      room,
      identity,
      canPublish,
    });

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity,
      }
    );

    token.addGrant({
      roomJoin: true,
      room,
      canPublish,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({
      token: jwt,
    });
  } catch (err) {
    console.error("TOKEN ERROR", err);

    return NextResponse.json(
      {
        error: "Failed to create token",
      },
      {
        status: 500,
      }
    );
  }
}