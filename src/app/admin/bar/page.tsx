"use client";

import { useSession } from "next-auth/react";
import { Providers } from "../helper";

// Frontend - Add React Hook
function Bar() {
  const { data: session } = useSession();
  return (
    <>
      bar
      <hr />
      <pre>{JSON.stringify({ session }, null, 1)}</pre>
    </>
  );
}

export default function FC() {
  return (
    <Providers>
      <Bar />
    </Providers>
  );
}
