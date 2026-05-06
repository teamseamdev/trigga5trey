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

/* 🔥 LIVE CHECK */
export async function GET() {
  try {
    const live = await isTwitchLive("trigga5trey");

    /* 🔥 STREAM STATUS DOC */
    const statusRef = db.collection("streamStatus").doc("main");

    const statusSnap = await statusRef.get();

    const previousData = statusSnap.exists
      ? statusSnap.data()
      : { isLive: false };

    const wasLive = previousData?.isLive || false;

    console.log("📡 Twitch live:", live);
    console.log("📡 Previous live:", wasLive);

    /* 🔥 JUST WENT LIVE */
    if (live && !wasLive) {
      console.log("🚀 Stream went LIVE");

      const snapshot = await db.collection("tokens").get();

      const tokens: string[] = snapshot.docs.map((doc) =>
        doc.id
          .trim()
          .replace(/\s+/g, "")
          .replace(/[^\x00-\x7F]/g, "")
      );

      if (tokens.length) {
        const response = await admin
          .messaging()
          .sendEachForMulticast({
            tokens,

            notification: {
              title: "🔴 LIVE NOW",
              body: "Trigga5Trey just went live 🚀",
            },

            /* 🔥 Deep link */
            data: {
              url: "/live",
            },

            webpush: {
              notification: {
                icon: "/icon-512.png",
                badge: "/badge.png",
              },

              fcmOptions: {
                link: "/live",
              },
            },
          });

        console.log(
          `📢 LIVE notification sent to ${response.successCount} users`
        );

        /* 🔥 Cleanup invalid tokens */
        response.responses.forEach(async (resp, idx) => {
          if (!resp.success) {
            console.log("❌ Removing invalid token:", tokens[idx]);

            try {
              await db.collection("tokens").doc(tokens[idx]).delete();
            } catch (deleteErr) {
              console.error("Token delete error:", deleteErr);
            }
          }
        });

        /* 🔥 Analytics */
        await db.collection("notifications").add({
          type: "live",
          title: "🔴 LIVE NOW",
          body: "Trigga5Trey just went live 🚀",
          sent: response.successCount,
          failed: response.failureCount,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        /* 🔥 Activity feed */
        await db.collection("activity").add({
          type: "live",
          message: "Trigga5Trey is LIVE 🔴",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    /* 🔥 STREAM ENDED */
    if (!live && wasLive) {
      console.log("⚫ Stream ended");

      await db.collection("activity").add({
        type: "offline",
        message: "Trigga5Trey stream ended",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    /* 🔥 UPDATE STATUS */
    await statusRef.set({
      isLive: live,

      lastChecked:
        admin.firestore.FieldValue.serverTimestamp(),

      lastLiveAt: live
        ? admin.firestore.FieldValue.serverTimestamp()
        : previousData?.lastLiveAt || null,
    });

    return NextResponse.json({
      success: true,
      live,
      previousLiveState: wasLive,
    });

  } catch (err) {
    console.error("LIVE CHECK ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Failed",
      },
      { status: 500 }
    );
  }
}