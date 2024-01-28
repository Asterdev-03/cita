import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return <section>{children}</section>;
}
