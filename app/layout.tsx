import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/app-provider";
import { AppSessionProvider } from "@/components/session-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    "shea butter",
    "leather products",
    "straw products",
    "ghanaian products",
    "ghanaian craftsmanship",
    "ghanaian art",
    "ghanaian culture",
    "ghanaian traditional",
    "ghanaian traditional culture",
    "ghanaian traditional craftsmanship",
    "ghanaian traditional art",
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
          <AppProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </AppProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
