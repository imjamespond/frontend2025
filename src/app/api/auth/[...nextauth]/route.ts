import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// https://next-auth.js.org/configuration/providers/oauth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
