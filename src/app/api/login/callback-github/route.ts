import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code) {
    console.log("Received code:", code);

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 3. 交换成功，重定向到应用首页或受保护页面
      return NextResponse.redirect(new URL("/", url.origin));
    }

    return NextResponse.json(error);
  }
  return NextResponse.error();
}
