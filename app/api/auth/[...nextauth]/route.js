// // app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope: "openid email profile https://www.googleapis.com/auth/drive.file",
//         },
//       },
//     }),
//   ],
//   callbacks: {
// <<<<<<< HEAD
//     async jwt({ token, account, profile }) {  // 👈 profile added
//       if (account && profile) {               // 👈 profile check
//         token.accessToken = account.access_token;
//         if (profile.email === "codershab@gmail.com") {
// =======
//     async jwt({ token, account, user }) {
//       // ✅ First time login
//       if (account && user) {
//         token.accessToken = account.access_token;

//         // ✅ Email ke basis pe role set
//         if (user.email === "codershab@gmail.com") {
// >>>>>>> 9231ad353e6e95e4ee64d8486660f2b898ff65d1
//           token.role = "admin";
//         } else {
//           token.role = "user";
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.role = token.role;
// <<<<<<< HEAD
//       session.accessToken = token.accessToken;
// =======
//       session.accessToken = token.accessToken; // 👈 frontend use karega
// >>>>>>> 9231ad353e6e95e4ee64d8486660f2b898ff65d1
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
