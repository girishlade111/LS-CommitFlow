/**
 * NextAuth API Route Handler
 * Handles all authentication requests for Spotify OAuth
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Type assertion to work around typedRoutes type checking
const GETHandler = handler as unknown as (
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) => Promise<Response>;

const POSTHandler = handler as unknown as (
  request: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) => Promise<Response>;

export { GETHandler as GET, POSTHandler as POST };
