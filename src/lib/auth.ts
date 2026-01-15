import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import SequelizeAdapter from "@auth/sequelize-adapter";
import sequelize from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "instructor" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "student" | "instructor" | "admin";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SequelizeAdapter(sequelize),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role ?? "student";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/",
    error: "/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
