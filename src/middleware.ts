export { default } from "next-auth/middleware";

// Prerequisites
// You must set the same secret in the middleware that you use in NextAuth. The easiest way is to set the NEXTAUTH_SECRET environment variable. 
// It will be picked up by both the NextAuth config, as well as the middleware config.
export const config = { matcher: ["/admin/:path*"] };
