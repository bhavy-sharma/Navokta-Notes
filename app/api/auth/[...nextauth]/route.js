// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive.file", // 👈 YEH HAI MAGIC!
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken; // 👈 Access Token session mein bhej do
      return session;
    },
    async jwt({ token, account }) {
      if (account) {

        token.accessToken = account.access_token; // 👈 JWT mein bhi save karo
        if (profile?.email === "codershab@gmail.com") {
        token.role = "admin";
      } else {
        token.role = "user"; // ya skip kar do
      }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };