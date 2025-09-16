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
          scope: "openid email profile https://www.googleapis.com/auth/drive.file",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // ✅ First time login
      if (account && user) {
        token.accessToken = account.access_token;

        // ✅ Email ke basis pe role set
        if (user.email === "codershab@gmail.com") {
          token.role = "admin";
        } else {
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken; // 👈 frontend use karega
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
