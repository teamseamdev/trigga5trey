import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 LAZY INIT */
function initFirebase() {
  if (admin.apps.length) return;

  const serviceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccount) {
    console.warn(
      "⚠️ Missing FIREBASE_SERVICE_ACCOUNT"
    );

    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(serviceAccount)
      ),
    });

    console.log(
      "🔥 Firebase initialized"
    );
  } catch (err) {
    console.error(
      "❌ Firebase init error:",
      err
    );
  }
}

/* 🔥 API ROUTE */

export async function POST(
  req: Request
) {
  try {
    initFirebase();

    if (!admin.apps.length) {
      return NextResponse.json(
        {
          error:
            "Firebase not initialized",
        },
        { status: 500 }
      );
    }

    const data = await req.json();

    console.log(
      "📨 Incoming request:",
      data
    );

    let {
      token,
      title,
      body,
      url,
    } = data;

    token = (token || "")
      .trim()
      .replace(/\s+/g, "")
      .replace(
        /[^\x00-\x7F]/g,
        ""
      );

    if (
      !token ||
      !title ||
      !body
    ) {
      return NextResponse.json(
        {
          error:
            "Missing fields",
        },
        { status: 400 }
      );
    }

    const response =
      await admin
        .messaging()
        .send({
          token,

          notification: {
            title,
            body,
          },

          data: {
            url: url || "/",
          },

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

    console.log(
      "✅ Sent successfully:",
      response
    );

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (err: any) {
    console.error(
      "🔥 SEND ERROR:",
      err?.message || err
    );

    return NextResponse.json(
      {
        error:
          "Failed to send",
        details:
          err?.message ||
          "Unknown error",
      },
      { status: 500 }
    );
  }
}