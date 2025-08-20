import { createClient } from "@/lib/supabase/server";

async function FC() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      user: <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}

export default FC;
