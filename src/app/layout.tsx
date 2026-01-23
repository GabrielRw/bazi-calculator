import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Bazi Calculator | Professional Chinese Astrology Engine",
  description: "Calculate your Four Pillars of Destiny with the True Bazi Calculator. High-precision engine featuring True Solar Time, Luck Cycles, Annual Flow, and detailed element analysis.",
  keywords: ["Bazi Calculator", "Four Pillars of Destiny", "Chinese Astrology", "Destiny Flow", "True Solar Time", "Pinyin Bazi", "Astrology Report"],
  authors: [{ name: "Gabriel" }],
  openGraph: {
    title: "True Bazi Calculator",
    description: "Professional grade Four Pillars of Destiny (BaZi) calculator with True Solar Time and interpretation.",
    type: "website",
  }
};

import TopNav from "@/components/TopNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0e0e0e] text-white min-h-screen relative selection:bg-jade/30 selection:text-jade-100`}
      >
        <TopNav />
        <main className="pt-20 md:pt-24 min-h-screen">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
