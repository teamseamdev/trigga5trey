import NextAuth from "next-auth";

import DiscordProvider from "next-auth/providers/discord";

/* 🔥 ADMIN ROLE IDS */
const ADMIN_ROLE_IDS = [
  "1436002230971928730",
  "1436002422781775883",
];

/* 🔥 GUILD */
const GUILD_ID =
  process.env.DISCORD_GUILD_ID!;

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId:
        process.env
          .DISCORD_CLIENT_ID!,

      clientSecret:
        process.env
          .DISCORD_CLIENT_SECRET!,

      authorization:
        {
          params: {
            scope:
              "identify guilds guilds.members.read",
          },
        },
    }),
  ],

  secret:
    process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }) {
      /* 🔥 KEEP EXISTING TOKEN */
      if (!account) {
        return token;
      }

      /* 🔥 BASIC USER INFO */
      token.discordId = (
        profile as any
      )?.id;

      token.username = (
        profile as any
      )?.username;

      token.avatar = (
        profile as any
      )?.avatar;

      token.accessToken =
        account.access_token;

      /* 🔥 DEFAULTS */
      token.roles = [];

      token.isAdmin = false;

      /* 🔥 FETCH MEMBER */
      try {
        console.log(
          "🔥 Fetching Discord member..."
        );

        console.log(
          "🔥 Guild ID:",
          GUILD_ID
        );

        const res = await fetch(
          `https://discord.com/api/v10/users/@me/guilds/${GUILD_ID}/member`,
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },

            cache: "no-store",
          }
        );

        console.log(
          "🔥 Discord status:",
          res.status
        );

        if (!res.ok) {
          const text =
            await res.text();

          console.error(
            "❌ Failed member fetch:",
            text
          );

          return token;
        }

        const member =
          await res.json();

        console.log(
          "🔥 DISCORD MEMBER:",
          member
        );

        console.log(
          "🔥 ROLES:",
          member.roles
        );

        const roles =
          member.roles || [];

        token.roles = roles;

        /* 🔥 ADMIN CHECK */
        token.isAdmin =
          roles.some(
            (roleId: string) =>
              ADMIN_ROLE_IDS.includes(
                roleId
              )
          );

        console.log(
          "🔥 IS ADMIN:",
          token.isAdmin
        );

      } catch (err) {
        console.error(
          "❌ Discord role fetch error:",
          err
        );
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      (session.user as any).id =
        token.discordId;

      (session.user as any).username =
        token.username;

      (session.user as any).avatar =
        token.avatar;

      (session.user as any).roles =
        token.roles || [];

      (session.user as any).isAdmin =
        token.isAdmin || false;

      return session;
    },
  },
});

export {
  handler as GET,
  handler as POST,
};