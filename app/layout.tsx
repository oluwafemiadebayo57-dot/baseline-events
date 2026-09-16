// app/layout.tsx
// The ROOT layout — wraps every page. Fonts and metadata live here.

import type { Metadata } from "next";
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
  title: "Baseline Events Center | Book Your Perfect Event",
  description:
    "Premium event hall and lounge for weddings, birthdays, and corporate events. Check availability and book online in minutes.",
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
        <Footer />
      </body>
    </html>
  );
}