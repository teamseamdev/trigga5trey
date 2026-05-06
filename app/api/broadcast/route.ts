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

/* 🔥 BROADCAST */
export async function POST(req: Request) {
  try {
    const { title, body } = await req.json();

    const snapshot = await db.collection("tokens").get();

    const tokens: string[] = snapshot.docs.map((doc) => doc.id);

    if (!tokens.length) {
      return NextResponse.json({ error: "No users" }, { status: 400 });
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
    });

    console.log("📢 Sent to:", response.successCount);

    return NextResponse.json({
      success: true,
      sent: response.successCount,
    });
  } catch (err) {
    console.error("BROADCAST ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}