import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

const popins = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CITA | Home",
  description: "Conversational Interview and Training Application",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          popins.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
