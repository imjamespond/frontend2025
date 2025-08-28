import { Providers } from "../helper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      order
      <hr />
      <Providers>{children}</Providers>
    </>
  );
}
