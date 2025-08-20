// middleware.js
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();

  // 刷新用户的会话，如果会话过期则更新
  await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // console.log('middleware called', user, pathname);
  

  // 未登录，拦截 /admin 路径
  if (!user && pathname.startsWith("/admin")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 如果用户已登录，则继续
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
