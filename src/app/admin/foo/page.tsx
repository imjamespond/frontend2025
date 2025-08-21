import { auth } from "@/lib/auth";

// Backend - API Route
// https://next-auth.js.org/configuration/nextjs#getserversession
async function FC() {
  const session = await auth();
  return (
    <>
      foo
      <hr />
      <pre>{JSON.stringify({ session }, null, 1)}</pre>
    </>
  );
}

export default FC;
