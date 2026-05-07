import { NextResponse } from "next/server";

import admin from "firebase-admin";

/* 🔥 FIREBASE INIT */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:
        process.env.FIREBASE_PROJECT_ID,

      clientEmail:
        process.env.FIREBASE_CLIENT_EMAIL,

      privateKey:
        process.env.FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
    }),
  });
}

const db = admin.firestore();

/* 🔥 DISCORD ROLE IDS */
const ROLE_IDS = {
  whitelist: "1474944355436331059",

  business: "1478547781970038835",

  bayside: "1499498301668724878",

  gmsl: "1499495752710361088",

  publicsafety: "1478443485148217424",
};

export async function GET() {
  try {
    const guildId =
      process.env.DISCORD_GUILD_ID;

    const token =
      process.env.DISCORD_BOT_TOKEN;

    if (!guildId || !token) {
      return NextResponse.json(
        {
          error:
            "Missing Discord environment variables",
        },
        { status: 500 }
      );
    }

    /* 🔥 FETCH MEMBERS */
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`,
      {
        headers: {
          Authorization: `Bot ${token}`,
        },

        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();

      console.error(
        "Discord API Error:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch Discord members",
        },
        { status: 500 }
      );
    }

    const members = await res.json();

    /* 🔥 COMMUNITY COUNTS */
    const counts = {
      citizens: 0,

      businesses: 0,

      bayside: 0,

      gmsl: 0,

      publicSafety: 0,
    };

    members.forEach((member: any) => {
      const roles = member.roles || [];

      /* 🔥 Whitelist */
      if (
        roles.includes(
          ROLE_IDS.whitelist
        )
      ) {
        counts.citizens++;
      }

      /* 🔥 Business Owners */
      if (
        roles.includes(
          ROLE_IDS.business
        )
      ) {
        counts.businesses++;
      }

      /* 🔥 Bayside */
      if (
        roles.includes(
          ROLE_IDS.bayside
        )
      ) {
        counts.bayside++;
      }

      /* 🔥 GMSL */
      if (
        roles.includes(
          ROLE_IDS.gmsl
        )
      ) {
        counts.gmsl++;
      }

      /* 🔥 Public Safety */
      if (
        roles.includes(
          ROLE_IDS.publicsafety
        )
      ) {
        counts.publicSafety++;
      }
    });

    /* 🔥 SAVE TO FIRESTORE */
    await db
      .collection("communityStats")
      .doc("live")
      .set({
        ...counts,

        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(
      "🔥 Discord sync complete",
      counts
    );

    return NextResponse.json({
      success: true,
      counts,
    });

  } catch (err) {
    console.error(
      "DISCORD SYNC ERROR:",
      err
    );

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}