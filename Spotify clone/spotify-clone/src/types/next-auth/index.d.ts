/**
 * NextAuth Type Declarations
 * Extends NextAuth types with custom session and JWT properties
 */

import type { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend the built-in Session type
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    userId?: string;
    username?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id?: string;
    username?: string;
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
    userId?: string;
    username?: string;
  }
}
