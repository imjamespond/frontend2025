import { SWRConfig } from "swr";
import { Navigator } from "./helper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      admin: <Navigator />
      <hr />
      <SWRConfig
        value={{
          dedupingInterval: 10_000,
          revalidateIfStale: true, // 当有旧数据时是否刷新
          revalidateOnMount: true,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }}
      >
        {children}
      </SWRConfig>
    </>
  );
}
