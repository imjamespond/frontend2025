import { Navigator, Providers } from "./helper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      admin: <Navigator />
      <hr />
      <Providers>{children}</Providers>
    </>
  );
}
