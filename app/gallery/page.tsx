// app/gallery/page.tsx
// Server wrapper — SEO metadata for the gallery page.

import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery — See Baseline Event Centre in Photos",
  description:
    "Browse 29 real photos of The Grand Ballroom, The Mini Ballroom, VIP lounge, facilities, and grounds at Baseline Event Centre, Akure.",
  keywords: [
    "event hall photos Akure",
    "wedding venue gallery Nigeria",
    "Baseline Event Centre photos",
    "banquet hall pictures Akure",
  ],
  openGraph: {
    title: "Gallery — Baseline Event Centre, Akure",
    description:
      "29 real photos of our halls, lounge, facilities, and grounds. See the space before you book.",
    url: "https://baselineeventcentre.com/gallery",
    siteName: "Baseline Event Centre",
    locale: "en_NG",
    type: "website",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}