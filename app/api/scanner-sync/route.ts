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
    /* 🔥 FETCH RECENT DISPATCHES */

    const res = await fetch(
      `https://discord.com/api/v10/channels/${SCANNER_CHANNEL_ID}/messages?limit=10`,
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

    /* 🔥 PARSE + SAVE */

    for (const msg of messages) {
      const embed =
        msg.embeds?.[0];

      if (!embed) continue;

      /* 🔥 PREVENT DUPES */

      const existing =
        await db
          .collection(
            "scannerFeed"
          )
          .doc(msg.id)
          .get();

      if (existing.exists) {
        continue;
      }

      const raw =
        embed.description || "";

      /* 🔥 DESCRIPTION */

      const descMatch =
        raw.match(
          /"description":\s*"([^"]+)"/
        );

      /* 🔥 PRIORITY */

      const priorityMatch =
        raw.match(
          /"priority":\s*"([^"]+)"/
        );

      /* 🔥 CODE */

      const codeMatch =
        raw.match(
          /"code":\s*"([^"]+)"/
        );

      const code =
        codeMatch?.[1] || "";

      /* 🔥 TITLE CLEANUP */

      let cleanTitle =
        embed.title?.replace(
          "New Dispatch: ",
          ""
        ) || "Dispatch";

      if (code === "10-911") {
        cleanTitle =
          "911 Call";
      }

      if (
        cleanTitle.includes(" - ")
      ) {
        cleanTitle =
          cleanTitle.split(
            " - "
          )[0];
      }

      /* 🔥 TIME */

      const createdAt =
        new Date(
          msg.timestamp
        );

    
          /* 🔥 DUPLICATE CHECK */

          const duplicateCheck =
            await db
              .collection("scannerFeed")
              .where(
                "title",
                "==",
                cleanTitle
              )
              .where(
                "description",
                "==",
                descMatch?.[1] ||
                  "No description"
              )
              .where(
                "code",
                "==",
                code
              )
              .get();

          if (!duplicateCheck.empty) {
            continue;
          }



      /* 🔥 SAVE */

     
        await db
          .collection(
            "scannerFeed"
          )
          .doc(msg.id)
          .set({
            title: cleanTitle,

            description:
              descMatch?.[1] ||
              "No description",

            priority:
              priorityMatch?.[1] ||
              "unknown",

            code,

            createdAt,
          });


    }

    /* 🔥 KEEP ONLY LATEST 6 */

    const snapshot =
      await db
        .collection(
          "scannerFeed"
        )
        .orderBy(
          "createdAt",
          "desc"
        )
        .get();

    if (snapshot.size > 6) {
      const oldDocs =
        snapshot.docs.slice(6);

      const deleteBatch =
        db.batch();

      oldDocs.forEach((doc) => {
        deleteBatch.delete(
          doc.ref
        );
      });

      await deleteBatch.commit();
    }

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