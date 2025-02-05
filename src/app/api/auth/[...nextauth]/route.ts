import NextAuth, { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers"; // Import cookies correctly
import { NextRequest, NextResponse } from "next/server"; // For Next.js 13+ routing

// Define your NextAuth options
const authOptions: NextAuthOptions = {
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
        const typedUser = user as { id: string; name: string; email: string; image: string };
        token.id = typedUser.id;
        token.name = typedUser.name;
        token.email = typedUser.email;
        token.picture = typedUser.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;

        // ✅ Correct way to set cookies (use await)
        const cookieStore = await cookies();
        cookieStore.set("userSession", JSON.stringify(session.user), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(Date.now() + 60 * 60 * 1000),
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

// Create a helper function to handle the request
const authHandler = (req: NextRequest, res: NextResponse) => {
  return NextAuth(req as any, res as any, authOptions); // cast as any to bypass type mismatch
};

// The GET and POST functions for handling API routes in Next.js 13+
export async function GET(req: NextRequest) {
  return authHandler(req, NextResponse.next());
}

export async function POST(req: NextRequest) {
  return authHandler(req, NextResponse.next());
}
