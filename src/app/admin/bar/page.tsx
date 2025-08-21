"use client";

import { useSession } from "next-auth/react";

// Frontend - Add React Hook
function FC() {
  const { data: session } = useSession();
  return (
    <>
      bar
      <hr />
      <pre>{JSON.stringify({ session }, null, 1)}</pre>
    </>
  );
}

export default FC;
