import { NextResponse } from "next/server";
import admin from "firebase-admin";

/* 🔥 FIREBASE INIT */

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
  );

  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount
    ),
  });
}

const db = admin.firestore();

/* 🔥 SAVE PUSH TOKEN */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = body.token;

    if (!token) {
      return NextResponse.json(
        {
          error: "Missing token",
        },
        {
          status: 400,
        }
      );
    }

    /* 🔥 SAVE TOKEN */

    await db
      .collection("tokens")
      .doc(token)
      .set({
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(
      "✅ Token saved:",
      token
    );

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(
      "SAVE TOKEN ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to save token",
      },
      {
        status: 500,
      }
    );
  }
}