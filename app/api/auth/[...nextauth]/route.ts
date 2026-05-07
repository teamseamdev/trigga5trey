import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as any).id;
        token.username = (profile as any).username;
        token.avatar = (profile as any).avatar;
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as any).id =
        token.discordId as string;

      (session.user as any).username =
        token.username as string;

      (session.user as any).avatar =
        token.avatar as string;

      return session;
    },
  },
});

export { handler as GET, handler as POST };