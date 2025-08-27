// import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// export { default } from "next-auth/middleware";

// Prerequisites
// You must set the same secret in the middleware that you use in NextAuth. The easiest way is to set the NEXTAUTH_SECRET environment variable.
// It will be picked up by both the NextAuth config, as well as the middleware config.
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token);

    const token = req.nextauth.token;
    if (token === null) {
      // If the request is for an API, the code returns 401
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If there is a token, continue to the requested page.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: (args) => {
        const isApi = args.req.nextUrl.pathname.startsWith("/api");
        if (isApi) {
          return true;
        }
        if (args.token) {
          return true;
        }
        // If it returns false, the user is redirected to the sign-in page instead
        return false;
      },
    },
  }
);
// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
// }
