import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { token, title, body } = await req.json();

  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
  });

  return NextResponse.json({ success: true });
}