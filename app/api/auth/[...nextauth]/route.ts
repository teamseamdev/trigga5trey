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
        "https://discord.com/api/oauth2/authorize?scope=identify guilds guilds.members.read",
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
      /* 🔥 INITIAL LOGIN */
      if (account && profile) {
        token.discordId = (
          profile as any
        ).id;

        token.username = (
          profile as any
        ).username;

        token.avatar = (
          profile as any
        ).avatar;

        /* 🔥 FETCH MEMBER ROLES */
        try {
          const res = await fetch(
            `https://discord.com/api/v10/users/@me/guilds/${GUILD_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (res.ok) {
            const member =
              await res.json();

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
          } else {
            console.error(
              "Failed to fetch guild member"
            );

            token.roles = [];

            token.isAdmin = false;
          }
        } catch (err) {
          console.error(
            "Discord role fetch error:",
            err
          );

          token.roles = [];

          token.isAdmin = false;
        }
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