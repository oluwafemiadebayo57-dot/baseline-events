// app/layout.tsx
// The ROOT layout — wraps every page. Fonts and metadata live here.

import type { Metadata } from "next";
import { Suspense } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Load our two fonts from Google. Each becomes a CSS variable
// that globals.css references.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Shows in the browser tab + Google search results.
export const metadata: Metadata = {
  metadataBase: new URL("https://baselineeventcentre.com"),
  title: {
    default: "Baseline Event Centre | Akure's Premier Event Venue",
    template: "%s | Baseline Event Centre",
  },
  description:
    "Two premium halls for weddings, conferences, banquets, and celebrations in Akure, Ondo State. Check availability and book online in minutes.",
  keywords: [
    "event centre in Akure",
    "event hall Akure",
    "wedding venue Akure",
    "conference venue Akure",
    "banquet hall Ondo State",
    "Baseline Event Centre",
  ],
  openGraph: {
    title: "Baseline Event Centre — Akure's Premier Event Venue",
    description:
      "Two premium halls for weddings, conferences, and celebrations. Book online in minutes.",
    url: "https://baselineeventcentre.com",
    siteName: "Baseline Event Centre",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseline Event Centre — Akure's Premier Event Venue",
    description:
      "Two premium halls for weddings, conferences, and celebrations. Book online in minutes.",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
        <Suspense fallback={<div className="bg-navy h-40" />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}