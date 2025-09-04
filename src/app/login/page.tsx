"use client";

import { useMut } from "@/lib/api";
import { Input } from "@/lib/components/input";
import { useSignUpMut } from "@/lib/service/user";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// import { useSearchParams } from "next/navigation";
import React, { FormEventHandler, Suspense, useRef } from "react";
import useSWR from "swr";

function Login() {
  // const searchParams = useSearchParams();
  const { data: csrf } = useSWR("/api/auth/csrf", async () => {
    return "";
    // https://next-auth.js.org/getting-started/client
    // return await getCsrfToken();
    // https://next-auth.js.org/getting-started/rest-api
    // return (await fetch(url)).json();
  });
  const { data: providers } = useSWR(
    "/api/auth/providers",
    async () => {
      return await getProviders();
    },
    { refreshInterval: 1000_000 }
  );
  const [signInBtn, signInDlg] = useSignIn();
  const [signUpBtn, signUpDlg] = useSignUp();
  const [signInPageBtn, signInPageDlg] = useSignInPage();
  return (
    <>
      Sign in by：
      {signUpBtn}
      {signInBtn}
      {signInPageBtn}
      {/* <button
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
      </button> */}
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
      <button onClick={() => signIn("gitee", { callbackUrl: "/" })}>gitee</button>
      <button onClick={() => signIn("aliyun", { callbackUrl: "/" })}>aliyun</button>
      <hr />
      <pre>{JSON.stringify({ csrf, providers }, null, 1)}</pre>
      {signUpDlg}
      {signInDlg}
      {signInPageDlg}
    </>
  );
}

export default function FC() {
  // Due to build Error: useSearchParams() should be wrapped in a suspense boundary at page
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

function useSignIn() {
  const searchParams = useSearchParams();
  const [signInFn, signIning] = useMut<{ username: string; password: string }>(
    "signIn",
    async (_, { arg: { username, password } }) => {
      if (!username || !password) throw "username or password is empty";
      const resp = await signIn("credentials", {
        redirect: true, // 为true时 resp也为空
        callbackUrl: searchParams.get("callbackUrl") || "/",
        username,
        password,
      });
      console.log(resp);
      // if (resp?.ok) {
      //   alert("Sign in successful!");
      // } else {
      //   alert("Sign in failed!");
      // }
    }
  );
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const { username, password } = e.currentTarget;
    signInFn({ username: username.value, password: password.value });
  };

  const ref = useRef<HTMLDialogElement>(null);

  const dialog = (
    <dialog ref={ref} style={{ width: 500, height: 400, margin: "150px auto" }}>
      <form onSubmit={handleSubmit}>
        <Input id="si_username" name="username" label="Email" />
        <br />
        <Input id="si_password" name="password" label="Password" type="password" autoComplete="current-password" />
        <br />
        <button type="button" onClick={() => ref.current?.close()}>
          Cancel
        </button>
        <button type="submit" disabled={signIning}>
          Sign In{signIning ? "..." : ""}
        </button>
      </form>
    </dialog>
  );

  const btn = <button onClick={() => ref.current?.showModal()}>Sign In</button>;

  return [btn, dialog] as const;
}

function useSignUp() {
  const [trigger, isMutating, data, error] = useSignUpMut();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { username, password, email } = e.currentTarget;
    await trigger({
      body: { username: username.value, password: password.value, email: email.value },
    });
  };

  const ref = useRef<HTMLDialogElement>(null);

  const dialog = (
    <dialog ref={ref} style={{ width: 500, height: 400, margin: "150px auto" }}>
      <form onSubmit={handleSubmit}>
        <Input id="su_username" name="username" label="Username" />
        <br />
        <Input name="email" label="Email" type="email" />
        <br />
        <Input id="su_password" name="password" label="Password" type="password" autoComplete="current-password" />
        <br />
        <button type="button" onClick={() => ref.current?.close()}>
          Cancel
        </button>
        <button type="submit" disabled={isMutating}>
          Sign Up
        </button>
      </form>
      <pre> {JSON.stringify({ data, error }, null, 2)}</pre>
      <br />
    </dialog>
  );

  const btn = <button onClick={() => ref.current?.showModal()}>Sign Up</button>;

  return [btn, dialog] as const;
}

function useSignInPage() {
  const ref = useRef<HTMLDialogElement>(null);
  const dialog = (
    <dialog ref={ref} style={{ width: 600, height: 600, margin: "150px auto", overflow: "hidden" }}>
      {/* <iframe style={{ width: "100%", height: "100%" }} src="/api/auth/signin" /> */}
      <button type="button" onClick={() => ref.current?.close()}>
        Cancel
      </button>
    </dialog>
  );
  const btn = <button onClick={() => ref.current?.showModal()}>Sign In Page</button>;
  return [btn, dialog] as const;
}
