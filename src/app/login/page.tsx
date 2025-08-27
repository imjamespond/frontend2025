"use client";

import { useSignUpMut, useUserMut } from "@/lib/service/user";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// import { useSearchParams } from "next/navigation";
import React, { FormEventHandler, InputHTMLAttributes, useRef } from "react";
import useSWR from "swr";

function FC() {
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
      <hr />
      <pre>{JSON.stringify({ csrf, providers }, null, 1)}</pre>
      {signUpDlg}
      {signInDlg}
      {signInPageDlg}
    </>
  );
}

export default FC;

function useSignIn() {
  const searchParams = useSearchParams();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const { username, password } = e.currentTarget;
    const resp = await signIn("credentials", {
      redirect: true, // 为true时 resp也为空
      callbackUrl: searchParams.get("callbackUrl") || "/",
      username: username.value,
      password: password.value,
    });
    console.log(resp);
    // if (resp?.ok) {
    //   alert("Sign in successful!");
    // } else {
    //   alert("Sign in failed!");
    // }
  };

  const ref = useRef<HTMLDialogElement>(null);

  const dialog = (
    <dialog ref={ref} style={{ width: 500, height: 400, margin: "150px auto" }}>
      <form onSubmit={handleSubmit}>
        <Input name="username" label="Email" />
        <br />
        <Input name="password" label="Password" type="password" />
        <br />
        <button type="button" onClick={() => ref.current?.close()}>
          Cancel
        </button>
        <button type="submit">Sign In</button>
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
        <Input name="username" label="Username" />
        <br />
        <Input name="email" label="Email" type="email" />
        <br />
        <Input name="password" label="Password" type="password" />
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

const Input = ({
  name,
  label,
  type,
}: {
  name: string;
  label?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}) => {
  return (
    <>
      <label htmlFor={name}>{label || name}:</label>
      <input id={name} name={name} type={type ?? "text"} />
    </>
  );
};

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
