import NextAuth, { NextAuthOptions, User } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers"; // Import cookies correctly
import { NextApiRequest, NextApiResponse } from "next"; // Import types for request and response

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

// Export methods directly (GET, POST) with correct types for req and res
export const GET = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
export const POST = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
