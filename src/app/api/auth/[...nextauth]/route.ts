import NextAuth, { NextAuthOptions, User } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers"; // Import cookies correctly

export const authOptions: NextAuthOptions = {
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || "",
      clientSecret: process.env.FACEBOOK_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cast user to include 'id' property
        const typedUser = user as User & { id: string }; // Ensure `id` exists
        token.id = typedUser.id;
        token.name = typedUser.name;
        token.email = typedUser.email;
        token.picture = typedUser.image;
      }
      return token;
    },
    async session({ session, token }) {
      
      if (session.user) {
        session.user.id = token.id as string; // Ensure id exists in session user
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;

        // ✅ Correct way to set cookies (use await)
        const cookieStore = await cookies(); // Await cookies() to resolve the promise
        cookieStore.set("userSession", JSON.stringify(session.user), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
        });
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, handler as default };
