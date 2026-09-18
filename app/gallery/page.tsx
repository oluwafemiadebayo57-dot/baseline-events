// app/gallery/page.tsx
// Gallery — photos + video tours of both halls.
// Placeholder images/videos for now; swap in real ones later.

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ---------- MEDIA (swap these when real assets are ready) ----------
// Each section gets its own image array. Replace the URLs when the
// client sends real photos (or after we upload to Supabase Storage).

const BIG_HALL_IMAGES = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80",
];

const SMALL_HALL_IMAGES = [
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=80",
];

// Video tours — replace these placeholder YouTube IDs with the real ones.
// Just the ID, not the full URL. Example:
// https://youtu.be/dQw4w9WgXcQ  →  "dQw4w9WgXcQ"
const VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "The Big Hall — Full Tour" },
  { id: "dQw4w9WgXcQ", title: "The Small Hall — Full Tour" },
  { id: "dQw4w9WgXcQ", title: "Event Highlights" },
];

// ---------- PAGE ----------
export default function GalleryPage() {
  // Which image is open in the lightbox (null = closed)
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-navy py-20 text-center text-cream">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
            See It Before You Book
          </p>
          <h1 className="font-heading text-5xl font-bold md:text-6xl">
            The <span className="text-gold">Gallery</span>
          </h1>
          <p className="mt-6 text-lg text-cream/70">
            Real photos. Real moments. Real space.
          </p>
        </div>
      </section>

      {/* Big Hall images */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-4xl font-bold text-navy">
                The Big Hall
              </h2>
              <p className="mt-1 text-navy/60">
                Up to 1,000 guests. Grand setting, unforgettable events.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BIG_HALL_IMAGES.map((src, i) => (
              <GalleryTile
                key={i}
                src={src}
                alt={`Big Hall ${i + 1}`}
                onClick={() => setLightbox(src)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Small Hall images */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-4xl font-bold text-navy">
                The Small Hall
              </h2>
              <p className="mt-1 text-navy/60">
                Up to 150 guests. Intimate, elegant, focused.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SMALL_HALL_IMAGES.map((src, i) => (
              <GalleryTile
                key={i}
                src={src}
                alt={`Small Hall ${i + 1}`}
                onClick={() => setLightbox(src)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-navy py-20 text-cream">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold md:text-5xl">
            Video <span className="text-gold">Tours</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-cream/70">
            Walk through both halls without leaving your seat.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-cream/10 bg-navy/50"
              >
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-4 text-sm text-cream/80">{v.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-heading text-4xl font-bold text-navy">
            Like what you see?
          </h2>
          <p className="mt-4 text-navy/70">
            Lock your date in minutes — online, no calls.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
          >
            Book Your Date →
          </Link>
        </div>
      </section>

      {/* Lightbox — click any image to open full-screen */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-3xl text-cream/80 hover:text-cream"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="relative aspect-[4/3] w-full max-w-5xl">
            <Image
              src={lightbox}
              alt="Full view"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}

// ---------- Small reusable image tile ----------
function GalleryTile({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-xl"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Hover overlay with a "+" icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all group-hover:bg-navy/40 group-hover:opacity-100">
        <span className="text-3xl text-cream">⤢</span>
      </div>
    </button>
  );
}