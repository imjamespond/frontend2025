"use client";

import { testdb } from "@/lib/db/test";
import { useUserMut } from "@/lib/service/user";
import useSWR from "swr";

type PromiseOf<T> = T extends Promise<infer U> ? U : never;
function FC({ users }: { users: ReturnType<typeof testdb> }) {
  const { data, isLoading } = useSWR<PromiseOf<ReturnType<typeof testdb>>>("test/users", () => users);
  const [trigger, isMutating] = useUserMut();
  if (isMutating || isLoading) {
    return <i>Loading....</i>;
  }
  return (
    <>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {JSON.stringify(user)},
            <button
              onClick={async () => {
                const rs = await trigger({ params: { action: "delete" }, body: { email: user.email } });
                if (rs === "ok") {
                  alert("delete OK");
                  window.location.reload();
                }
              }}
            >
              del
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default FC;
