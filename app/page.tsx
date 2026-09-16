// app/page.tsx
// The homepage. This is the first thing every visitor sees.
// It's built from 5 sections stacked top to bottom.

import Link from "next/link";
import Image from "next/image";

// Placeholder images — swap these URLs for the client's real photos later.
// All hosted on Unsplash (free, no copyright issues for the demo).
const heroImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
];

const galleryImages = [
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
];

export default function HomePage() {
  return (
    <main>
      {/* ============ SECTION 1: HERO ============
          Big headline, tagline, and two buttons. */}
      <section className="relative overflow-hidden bg-plum text-cream">
        {/* Background image with a dark overlay */}
        <div className="absolute inset-0">
          <Image
            src={heroImages[0]}
            alt="Event hall"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>

        {/* The actual text content — z-10 puts it above the background */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center md:py-40">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-accent animate-fade-up">
            Akure&apos;s Premier Event Venue
          </p>
          <h1 className="font-heading text-5xl font-bold leading-tight md:text-7xl animate-fade-up">
            Where Your <span className="text-purple">Memories</span> Begin
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/80 animate-fade-up">
            A 1,000-guest hall and elegant lounge for weddings, birthdays, and
            corporate events. Check availability and lock your date online — in
            minutes.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="rounded-full bg-accent px-8 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Check Available Dates
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-cream/40 px-8 py-4 font-semibold text-cream transition-colors hover:bg-cream hover:text-plum"
            >
              See the Hall
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: FEATURES ============
          Three cards: capacity, amenities, location. */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold text-plum md:text-5xl">
            Why Book With Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-plum/70">
            Everything you need for an unforgettable event — in one elegant
            space.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "👥",
                title: "1,000 Guests",
                text: "Spacious hall with room for large weddings, conferences, and celebrations.",
              },
              {
                icon: "✨",
                title: "Premium Amenities",
                text: "Air conditioning, ample parking, stage, lighting, and a dedicated lounge.",
              },
              {
                icon: "📍",
                title: "Prime Location",
                text: "Central Akure — easy to find, easy to reach, with secure surroundings.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-plum">
                  {feature.title}
                </h3>
                <p className="mt-3 text-plum/70">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: GALLERY ============
          Grid of 6 images with a hover zoom. */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold text-plum md:text-5xl">
            A Glimpse Inside
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-plum/70">
            From intimate gatherings to grand celebrations — the space adapts to
            your vision.
          </p>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: CTA ============
          Big purple banner pushing to /booking. */}
      <section className="bg-purple py-24 text-center text-plum">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Ready to Lock Your Date?
          </h2>
          <p className="mt-4 text-lg text-plum/80">
            Check availability in real time. Pick your date, pay a small
            deposit, done.
          </p>
          <Link
            href="/booking"
            className="mt-10 inline-block rounded-full bg-accent px-10 py-4 text-lg font-semibold text-white shadow-xl transition-transform hover:scale-105"
          >
            Book Your Event →
          </Link>
        </div>
      </section>
    </main>
  );
}