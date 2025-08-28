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
      {children}
    </>
  );
}
