"use client";

import { createClient } from "@/lib/supabase/client";

function FC() {
  return (
    <>
      <button onClick={() => fetch("/api/login")}>test db</button>
      <br />
      <button
        onClick={async () => {
          const supabase = createClient();
          // const params = new URLSearchParams(window.location.search);
          await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: `${location.origin}/api/login/callback-github`,
            },
          });
        }}
      >
        github
      </button>
    </>
  );
}

export default FC;
