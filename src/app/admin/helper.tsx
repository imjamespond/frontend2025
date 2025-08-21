"use client";
import { SessionProvider, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// https://next-auth.js.org/getting-started/example#configure-shared-session-state
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function Navigator() {
  const pathname = usePathname();

  return (
    <>
      <Link className={pathname === "/admin/foo" ? "active" : ""} href={"/admin/foo"}>
        Foo
      </Link>
      <Link className={pathname === "/admin/bar" ? "active" : ""} href={"/admin/bar"}>
        Bar
      </Link>
      <button
        onClick={() => {
          signOut({ callbackUrl: "/login" });
        }}
      >
        Exit
      </button>
    </>
  );
}
