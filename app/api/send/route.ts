import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 LAZY INIT (SAFE FOR NEXT BUILD) */
function initFirebase() {
  if (admin.apps.length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Firebase env vars missing");
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });

    console.log("🔥 Firebase initialized");
  } catch (err) {
    console.error("Firebase init error:", err);
  }
}

/* 🔥 API ROUTE */
export async function POST(req: Request) {
  try {
    initFirebase();

    if (!admin.apps.length) {
      return NextResponse.json(
        { error: "Firebase not initialized" },
        { status: 500 }
      );
    }

    const { token, title, body } = await req.json();

    if (!token || !title || !body) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const response = await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
    });

    console.log("✅ Sent:", response);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND ERROR:", err);

    return NextResponse.json(
      { error: "Failed to send" },
      { status: 500 }
    );
  }
}