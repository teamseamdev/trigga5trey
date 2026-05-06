import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 LAZY INIT (SAFE FOR NEXT BUILD) */
function initFirebase() {
  if (admin.apps.length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ Missing Firebase env vars", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey,
    });
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
    console.error("❌ Firebase init error:", err);
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

    const data = await req.json();

    console.log("📨 Incoming request:", data);

    let { token, title, body } = data;

    // 🔥 HARD CLEAN TOKEN (fixes copy/paste + unicode issues)
    token = (token || "")
      .trim()
      .replace(/\s+/g, "") // remove spaces/newlines
      .replace(/[^\x00-\x7F]/g, ""); // remove weird unicode chars

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

    console.log("✅ Sent successfully:", response);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 SEND ERROR:", err?.message || err);

    return NextResponse.json(
      {
        error: "Failed to send",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}