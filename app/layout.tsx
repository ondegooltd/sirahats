import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppSessionProvider } from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sirahat - Handcrafted African Baskets",
  description:
    "Beautiful handwoven baskets and home decor from African artisans",
  generator: "v0.dev",
  keywords: [
    "ghana",
    "baskets",
    "village",
    "rural",
    "handwoven",
    "artisan",
    "africa",
    "kente",
    "decor",
    "home decor",
    "handcraft",
    "tray",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppSessionProvider>
          <AppProvider>{children}</AppProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
