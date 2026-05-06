import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 INIT */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/* 🔥 SAVE TOKEN */
export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 400 });
    }

    await db.collection("tokens").doc(token).set({
      token,
      createdAt: Date.now(),
    });

    console.log("💾 Saved token:", token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SAVE TOKEN ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}