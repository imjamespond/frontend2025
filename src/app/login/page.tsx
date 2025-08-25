"use client";

import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";

function FC() {
  const searchParams = useSearchParams();
  const { data: csrf } = useSWR("/api/auth/csrf", async () => {
    return "";
    // https://next-auth.js.org/getting-started/client
    // return await getCsrfToken();
    // https://next-auth.js.org/getting-started/rest-api
    // return (await fetch(url)).json();
  });
  const { data: providers } = useSWR("/api/auth/providers", async () => {
    return await getProviders();
  });
  return (
    <>
      <hr />
      {/* <iframe style={{ width: "100%", height: "300px" }} src="/api/auth/signin" /> */}
      Sign in by：
      <button
        onClick={() =>
          signIn("credentials", {
            // redirect: false,
            callbackUrl: "/",
            username: searchParams.get("username"),
            password: searchParams.get("password"),
          })
        }
      >
        credentials
      </button>
      <button onClick={() => signIn("github", { callbackUrl: "/" })}>github</button>
      <button onClick={() => signIn("gitlab", { callbackUrl: "/" })}>gitlab</button>
      <button
        onClick={() => {
          signIn("google", { callbackUrl: "/" });
        }}
      >
        google
      </button>
      <button onClick={() => signIn("battlenet", { callbackUrl: "/" })}>battlenet</button>
      <hr />
      <pre>{JSON.stringify({ csrf, providers }, null, 1)}</pre>
    </>
  );
}

export default FC;
