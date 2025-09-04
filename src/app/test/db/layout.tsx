import { SWRConfig } from "swr";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 10_000,
        revalidateIfStale: true, // 当有旧数据时是否刷新
        revalidateOnMount: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        // fallback: {
        //   "test/users": Promise.resolve([{name: 'foobar'}]),
        // },
      }}
    >
      {children}
    </SWRConfig>
  );
}
