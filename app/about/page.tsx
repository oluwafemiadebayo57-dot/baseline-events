// app/about/page.tsx
// About page — updated for Baseline Event Centre.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/actions";

export const metadata: Metadata = {
  title:
    "About Us — Akure's Premier Event Centre | Baseline Event Centre",
  description:
    "Baseline Event Centre is Akure's top event venue for weddings, conferences, and celebrations. Two premium halls — The Grand Ballroom (1,000 guests) and The Mini Ballroom (150 guests). 24/7 power, spacious parking, and online booking.",
  keywords: [
    "event centre in Akure",
    "wedding venue Akure",
    "event hall Ondo State",
    "conference venue Akure",
    "banquet hall Nigeria",
    "Baseline Event Centre",
    "Grand Ballroom Akure",
    "Mini Ballroom Akure",
  ],
  openGraph: {
    title: "About Baseline Event Centre — Akure's Premier Event Venue",
    description:
      "Two premium halls for weddings, conferences, and celebrations in Akure, Ondo State.",
    url: "https://baselineeventcentre.com/about",
    siteName: "Baseline Event Centre",
    locale: "en_NG",
    type: "website",
  },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-navy py-20 text-center text-cream">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
            About Us
          </p>
          <h1 className="font-heading text-5xl font-bold md:text-6xl">
            The <span className="text-gold">Baseline</span> Story
          </h1>
          <p className="mt-6 text-lg text-cream/70">
            {settings?.tagline ?? "Your Event, Our Priority"}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg"
            alt="Baseline Event Centre — Akure's premier event venue"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-heading text-4xl font-bold text-navy">
            Two Halls. One Standard.
          </h2>
          <div className="mt-6 space-y-4 text-navy/80">
            <p>
              Baseline Event Centre is Akure&apos;s premier destination for
              weddings, conferences, corporate events, banquets, and
              celebrations of every kind. With two fully equipped halls and a
              dedicated team, we&apos;ve hosted some of the city&apos;s most
              memorable moments.
            </p>
            <p>
              <strong>The Grand Ballroom</strong> seats up to 1,000 guests in
              conference style and 600 for banquets — built for grand
              celebrations. <strong>The Mini Ballroom</strong> holds up to 150
              guests, perfect for intimate gatherings and focused events.
            </p>
            <p>
              We believe booking a venue should be as easy as the event itself.
              That&apos;s why we built an online booking system — so you can
              check availability, reserve your date, and confirm in minutes.
              No endless phone calls. No back-and-forth. Just book.
            </p>
          </div>

          <Link
            href="/halls"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
          >
            See Our Halls →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 text-center md:grid-cols-4">
          {[
            { number: "2", label: "Premium Halls" },
            { number: "1,000", label: "Max Guests" },
            { number: "500+", label: "Events Hosted" },
            { number: "70", label: "Car Park Spaces" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-5xl font-bold text-gold">
                {stat.number}
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-navy/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-navy py-20 text-cream">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold md:text-5xl">
            What Every Booking <span className="text-gold">Includes</span>
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: "⏱️", label: "6-hour event duration" },
              { icon: "⚡", label: "24/7 power — BEDC + generator" },
              { icon: "🍽️", label: "Banquet tables & chairs" },
              { icon: "🥤", label: "Drink cooling service" },
              { icon: "👨‍🍳", label: "Outdoor wet-kitchen for caterers" },
              { icon: "🚗", label: "Car park for ~70 vehicles" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-cream/10 bg-navy/50 p-6 text-center"
              >
                <div className="text-3xl">{f.icon}</div>
                <div className="mt-3 text-sm text-cream/80">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-heading text-4xl font-bold text-navy">
            Ready to see it in person?
          </h2>
          <p className="mt-4 text-navy/70">
            Book a viewing, or lock your date online right now.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="rounded-full bg-gold px-8 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
            >
              Book Your Date →
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-navy/20 px-8 py-4 font-semibold text-navy transition-colors hover:bg-navy hover:text-cream"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}