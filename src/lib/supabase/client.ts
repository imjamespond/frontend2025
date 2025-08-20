// import { createClient as createCli } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
// https://supabase.com/docs/guides/auth/sessions/pkce-flow
export function createClient() {
  // 默认且自动使用 PKCE 流程
  return createBrowserClient(supabaseUrl, supabaseKey);
  // return createCli(supabaseUrl, supabaseKey, {
  //   auth: {
  //     // ...
  //     detectSessionInUrl: true,
  //     flowType: "pkce",
  //     // storage: {
  //     //   getItem: () => Promise.resolve("FETCHED_TOKEN"),
  //     //   setItem: () => {},
  //     //   removeItem: () => {},
  //     // },
  //   },
  // });
}
