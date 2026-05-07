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

const SCANNER_CHANNEL_ID =
  process.env
    .DISCORD_SCANNER_CHANNEL_ID!;

const BOT_TOKEN =
  process.env.DISCORD_BOT_TOKEN!;

export async function GET() {
  try {
    /* 🔥 FETCH DISCORD MESSAGES */

    const res = await fetch(
      `https://discord.com/api/v10/channels/${SCANNER_CHANNEL_ID}/messages?limit=5`,
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },

        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err =
        await res.text();

      console.error(err);

      return NextResponse.json(
        {
          error:
            "Failed to fetch scanner feed",
        },
        { status: 500 }
      );
    }

    const messages =
      await res.json();

    /* 🔥 CLEAR OLD FEED */

    const oldFeed =
      await db
        .collection("scannerFeed")
        .get();

    const batch =
      db.batch();

    oldFeed.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    /* 🔥 PARSE DISPATCHES */

    for (const msg of messages) {
      const embed =
        msg.embeds?.[0];

      if (!embed) continue;

      const raw =
        embed.description || "";

      /* 🔥 EXTRACT DATA */

      const mdtsMatch =
        raw.match(
          /"mdts":\s*\[\s*"([^"]+)"/
        );

      const descMatch =
        raw.match(
          /"description":\s*"([^"]+)"/
        );

      const priorityMatch =
        raw.match(
          /"priority":\s*"([^"]+)"/
        );

      const locationMatch =
        raw.match(
          /"label":\s*"([^"]+)"/g
        );

      const lastLocation =
        locationMatch?.[
          locationMatch.length - 1
        ];

      const cleanLocation =
        lastLocation
          ?.replace(
            /"label":\s*"/,
            ""
          )
          ?.replace(`"`, "");

      const dispatch = {
        title:
          embed.title ||
          "Unknown Dispatch",

        description:
          descMatch?.[1] ||
          "No description",

        mdts: mdtsMatch
          ? [mdtsMatch[1]]
          : [],

        priority:
          priorityMatch?.[1] ||
          "unknown",

        location:
          cleanLocation ||
          "Unknown Location",

       
createdAt: new Date(
  msg.timestamp
),


      };

      const ref = db
        .collection("scannerFeed")
        .doc(msg.id);

      batch.set(ref, dispatch);
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "SCANNER SYNC ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Scanner sync failed",
      },
      { status: 500 }
    );
  }
}