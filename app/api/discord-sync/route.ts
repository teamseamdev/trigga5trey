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

/* 🔥 ROLE CONFIG */
/* 
   EASY TO EDIT:
   key = Firestore/UI key
   label = display name
   id = Discord role ID
*/

const ROLE_CONFIG = {
  citizens: {
    label: "Citizens",

    roles: [
      "1474944355436331059",
    ],
  },

  businesses: {
    label: "Business Owners",

    roles: [
      "1478547781970038835",
    ],
  },

  gangMembers: {
    label: "Gang Members",

    roles: [
      "1499498301668724878", // Bayside
      "1499495752710361088", // GMSL
      "1501803880827326524", // M Hood
    ],
  },

  leo: {
    label: "LEO",

    roles: [
      "1478443485148217424",
    ],
  },

  safr: {
    label: "Fire/EMS",

    roles: [
      "1501808768630128760",
    ],
  },

  doj: {
    label: "Lawyers",

    roles: [
      "1501809512481296404",
    ],
  },

  mech: {
    label: "Mechanics",

    roles: [
      "1501809512355598468",
    ],
  },

  staff: {
    label: "Staff",

    roles: [
      "1474096471862153288",
      "1474944226881044680",
    ],
  },
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

    /* 🔥 FETCH DISCORD MEMBERS */
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
      const errorText =
        await res.text();

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

    /* 🔥 DYNAMIC COUNTS */
    const counts: Record<
      string,
      number
    > = {};

    Object.keys(ROLE_CONFIG).forEach(
      (key) => {
        counts[key] = 0;
      }
    );

    /* 🔥 LOOP MEMBERS */
    members.forEach((member: any) => {
      const roles =
        member.roles || [];

      Object.entries(
  ROLE_CONFIG
).forEach(([key, config]) => {
  const hasRole =
    config.roles.some(
      (roleId) =>
        roles.includes(roleId)
    );

  if (hasRole) {
    counts[key]++;
  }
});
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