import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { isTwitchLive } from "@/lib/twitch";

/* 🔥 INIT FIREBASE */
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

// 🔥 Prevent spam (memory cache)
let wasLive = false;

export async function GET() {
  try {
    const live = await isTwitchLive("trigga5trey");

    if (live && !wasLive) {
      wasLive = true;

      // 🔥 GET TOKENS
      const snapshot = await db.collection("tokens").get();
      const tokens = snapshot.docs.map((doc) => doc.id);

      if (tokens.length) {
        await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "🔴 LIVE NOW",
            body: "Trigga5Trey just went live 🚀",
          },
        });

        console.log("🚀 LIVE notification sent");
      }
    }

    if (!live) {
      wasLive = false;
    }

    return NextResponse.json({ live });
  } catch (err) {
    console.error("LIVE CHECK ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}