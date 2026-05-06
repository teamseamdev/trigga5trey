import { NextResponse } from "next/server";
import admin from "firebase-admin";

// 🔥 Prevent re-init
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is missing");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND ERROR:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
console.log("ENV CHECK:", {
  projectId: process.env.FIREBASE_PROJECT_ID,
  email: process.env.FIREBASE_CLIENT_EMAIL,
  hasKey: !!process.env.FIREBASE_PRIVATE_KEY,
});