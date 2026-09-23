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
  alternates: {
    canonical: "/",
  },
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

// Structured data for Google — tells search engines exactly what this
// business is, where it is, and how to contact it.
// Helps with local search and rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Baseline Event Centre",
  description:
    "Akure's premier event venue. Two premium halls — The Grand Ballroom (1,000 guests) and The Mini Ballroom (150 guests) — for weddings, conferences, banquets, and celebrations.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8 Gaga Road, Off Idanre Garage, Oke-Aro",
    addressLocality: "Akure",
    addressRegion: "Ondo State",
    addressCountry: "NG",
  },
  telephone: "+2348126671066",
  url: "https://baselineeventcentre.com",
  image:
    "https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg",
  priceRange: "₦₦₦",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning" },
    { "@type": "LocationFeatureSpecification", name: "Parking" },
    { "@type": "LocationFeatureSpecification", name: "Stage" },
    { "@type": "LocationFeatureSpecification", name: "Backup Power" },
    { "@type": "LocationFeatureSpecification", name: "Sound System" },
    { "@type": "LocationFeatureSpecification", name: "LED Screen" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        {/* Structured data for search engines — not visible to users */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Suspense fallback={<div className="bg-navy h-40" />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}