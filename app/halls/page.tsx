// app/halls/page.tsx
// Showcase page — both halls side by side with their real facilities, images, and prices.

import Link from "next/link";
import Image from "next/image";
import { getHalls } from "@/lib/actions";

type Hall = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  capacity_conf: number;
  capacity_banq: number;
  rental_price: number;
  caution_fee: number;
  facilities: string[];
  image_url: string | null;
  gallery: string[] | null;
};

const fmt = (n: number) => n.toLocaleString("en-NG");

export default async function HallsPage() {
  const halls = (await getHalls()) as Hall[];

  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-navy py-20 text-center text-cream">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
            Two Halls. One Standard.
          </p>
          <h1 className="font-heading text-5xl font-bold md:text-6xl">
            Our <span className="text-gold">Halls</span>
          </h1>
          <p className="mt-6 text-lg text-cream/70">
            From intimate gatherings to grand celebrations — choose the space
            that fits your event.
          </p>
        </div>
      </section>

      {/* Each hall */}
      {halls.map((hall, i) => (
        <section
          key={hall.id}
          className={i % 2 === 0 ? "bg-cream py-20" : "bg-white py-20"}
        >
          <div className="mx-auto max-w-6xl px-6">
            {/* Top: image + details */}
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              {/* Image side */}
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                {hall.image_url && (
                  <Image
                    src={hall.image_url}
                    alt={hall.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Details side */}
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h2 className="font-heading text-4xl font-bold text-navy md:text-5xl">
                  {hall.name}
                </h2>
                {hall.tagline && (
                  <p className="mt-2 text-lg text-navy/60 italic">
                    {hall.tagline}
                  </p>
                )}

                {/* Capacity */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-navy/5 p-4">
                    <div className="text-xs uppercase tracking-wider text-navy/50">
                      Conference
                    </div>
                    <div className="mt-1 font-heading text-2xl font-bold text-navy">
                      {fmt(hall.capacity_conf)}
                    </div>
                    <div className="text-xs text-navy/50">guests</div>
                  </div>
                  <div className="rounded-xl bg-navy/5 p-4">
                    <div className="text-xs uppercase tracking-wider text-navy/50">
                      Banquet
                    </div>
                    <div className="mt-1 font-heading text-2xl font-bold text-navy">
                      {fmt(hall.capacity_banq)}
                    </div>
                    <div className="text-xs text-navy/50">guests</div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mt-8">
                  <h3 className="font-heading text-lg font-semibold text-navy">
                    What&apos;s Included
                  </h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {hall.facilities.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-navy/80"
                      >
                        <span className="mt-0.5 text-gold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mt-8 space-y-3 rounded-2xl bg-navy p-6 text-cream">
                  <div className="flex items-center justify-between">
                    <span className="text-cream/70">Hall Rental</span>
                    <span className="font-heading text-2xl font-bold text-gold">
                      ₦{fmt(hall.rental_price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-cream/10 pt-3">
                    <span className="text-cream/70">Caution Fee</span>
                    <span className="font-heading text-xl font-semibold text-cream">
                      ₦{fmt(hall.caution_fee)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="mt-6 inline-block rounded-full bg-gold px-8 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
                >
                  Book {hall.name} →
                </Link>
              </div>
            </div>

            {/* Gallery preview — 5 smaller photos below */}
            {hall.gallery && hall.gallery.length > 1 && (
              <div className="mt-16">
                <h3 className="font-heading text-2xl font-semibold text-navy">
                  More Photos of {hall.name}
                </h3>
                <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-5">
                  {hall.gallery.slice(0, 5).map((src, idx) => (
                    <div
                      key={src}
                      className="group relative aspect-square overflow-hidden rounded-xl"
                    >
                      <Image
                        src={src}
                        alt={`${hall.name} — photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/gallery"
                    className="text-sm font-semibold text-navy hover:text-gold"
                  >
                    See full gallery →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* General facilities */}
      <section className="bg-navy py-20 text-cream">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold md:text-5xl">
            Facilities Available in <span className="text-gold">Both Halls</span>
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
      <section className="bg-cream py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-heading text-4xl font-bold text-navy">
            Ready to see them in person?
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