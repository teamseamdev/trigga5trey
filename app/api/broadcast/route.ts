import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 FIREBASE INIT */

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT!
  );

  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount
    ),
  });
}

const db = admin.firestore();

/* 🔥 BROADCAST */

export async function POST(
  req: Request
) {
  try {
    const {
      title,
      body,
      url,
    } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        {
          error:
            "Missing title or body",
        },
        { status: 400 }
      );
    }

    const snapshot =
      await db
        .collection("tokens")
        .get();

    const tokens: string[] =
      snapshot.docs.map((doc) =>
        doc.id
          .trim()
          .replace(/\s+/g, "")
          .replace(
            /[^\x00-\x7F]/g,
            ""
          )
      );

    if (!tokens.length) {
      return NextResponse.json(
        {
          error: "No users",
        },
        { status: 400 }
      );
    }

    const response =
      await admin
        .messaging()
        .sendEachForMulticast({
          tokens,

          notification: {
            title,
            body,
          },

          /* 🔥 Deep linking */

          data: {
            url: url || "/",
          },

          /* 🔥 iOS-safe webpush */

          webpush: {
            headers: {
              Urgency: "high",
            },

            notification: {
              icon:
                "/icon-512.png",
            },
          },
        });

    /* 🔥 Cleanup invalid tokens */

    response.responses.forEach(
      async (resp, idx) => {
        if (!resp.success) {
          console.log(
            "❌ Removing invalid token:",
            tokens[idx]
          );

          try {
            await db
              .collection(
                "tokens"
              )
              .doc(tokens[idx])
              .delete();
          } catch (deleteErr) {
            console.error(
              "Token delete error:",
              deleteErr
            );
          }
        }
      }
    );

    /* 🔥 Analytics log */

    await db
      .collection(
        "notifications"
      )
      .add({
        type: "broadcast",

        title,

        body,

        url: url || "/",

        sent:
          response.successCount,

        failed:
          response.failureCount,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    /* 🔥 Activity feed */

    await db
      .collection("activity")
      .add({
        type: "broadcast",

        title,

        body,

        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(
      "📢 Sent to:",
      response.successCount
    );

    return NextResponse.json({
      success: true,

      sent:
        response.successCount,

      failed:
        response.failureCount,
    });
  } catch (err) {
    console.error(
      "BROADCAST ERROR:",
      err
    );

    return NextResponse.json(
      {
        error: "Failed",
      },
      { status: 500 }
    );
  }
}