// app/page.tsx
// Homepage — updated for Baseline Event Centre.
// Real brand: navy + gold, two halls, real services from the flyer.

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
  image_url: string | null;
  gallery: string[] | null;
};

const fmt = (n: number) => n.toLocaleString("en-NG");

// Real Cloudinary images
const HERO_IMAGE =
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg";

const GALLERY_PREVIEW = [
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986403/_MG_9982.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986404/_MG_9942.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986414/_MG_9948.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986423/_MG_0057.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986449/_MG_0032.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986465/_MG_0016.jpg",
];

const FALLBACK_IMAGES: Record<string, string> = {
  "big-hall":
    "https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg",
  "small-hall":
    "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986441/_MG_0039.jpg",
};

export default async function HomePage() {
  const halls = (await getHalls()) as Hall[];

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-navy text-cream">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Baseline Event Centre"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center md:py-44">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold animate-fade-up">
            Akure&apos;s Premier Event Centre
          </p>
          <h1 className="font-heading text-5xl font-bold leading-tight md:text-7xl animate-fade-up">
            Your Event, <span className="text-gold">Our Priority</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/80 animate-fade-up">
            Two premium halls for weddings, conferences, banquets, and
            celebrations. Check availability and lock your date online — in
            minutes.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="rounded-full bg-gold px-8 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
            >
              Check Available Dates
            </Link>
            <Link
              href="/halls"
              className="rounded-full border-2 border-cream/40 px-8 py-4 font-semibold text-cream transition-colors hover:bg-cream hover:text-navy"
            >
              See Our Halls
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold text-navy md:text-5xl">
            Why Book With Us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-navy/70">
            Every detail designed for a seamless event.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🏛️",
                title: "Two Premium Halls",
                text: "The Big Hall seats 1,000. The Small Hall holds 150. Pick the space that fits your event.",
              },
              {
                icon: "⚡",
                title: "24/7 Power Supply",
                text: "BEDC electricity backed by standby generators. Your event never stops.",
              },
              {
                icon: "🚗",
                title: "Spacious Parking",
                text: "Room for ~70 vehicles on-site. No overflow, no stress for your guests.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-navy">
                  {feature.title}
                </h3>
                <p className="mt-3 text-navy/70">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OUR HALLS ============ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold text-navy md:text-5xl">
            Choose Your Space
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-navy/70">
            Two distinct halls — one unforgettable experience.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {halls.map((hall) => (
              <Link
                key={hall.id}
                href="/halls"
                className="group overflow-hidden rounded-2xl bg-cream shadow-md transition-shadow hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={
                      hall.image_url ??
                      FALLBACK_IMAGES[hall.slug] ??
                      FALLBACK_IMAGES["big-hall"]
                    }
                    alt={hall.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-heading text-3xl font-bold text-navy">
                    {hall.name}
                  </h3>
                  <p className="mt-1 text-sm text-navy/60 italic">
                    {hall.tagline}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy/80">
                    <div>
                      👥 <strong>{fmt(hall.capacity_conf)}</strong> conference
                    </div>
                    <div>
                      🍽️ <strong>{fmt(hall.capacity_banq)}</strong> banquet
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between border-t border-navy/10 pt-6">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-navy/50">
                        From
                      </div>
                      <div className="font-heading text-2xl font-bold text-gold">
                        ₦{fmt(hall.rental_price)}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-navy group-hover:text-gold">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-heading text-4xl font-bold text-navy md:text-5xl">
            A Glimpse Inside
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-navy/70">
            From intimate gatherings to grand celebrations — the space adapts
            to your vision.
          </p>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {GALLERY_PREVIEW.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-block rounded-full border-2 border-navy px-8 py-4 font-semibold text-navy transition-colors hover:bg-navy hover:text-cream"
            >
              See Full Gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SERVICES STRIP ============ */}
      <section className="bg-navy py-20 text-cream">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
            Every Booking Includes
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

      {/* ============ FINAL CTA ============ */}
      <section className="bg-gold py-24 text-center text-navy">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Ready to Lock Your Date?
          </h2>
          <p className="mt-4 text-lg text-navy/80">
            Check availability in real time. Pick your hall, choose your date,
            pay a small caution fee.
          </p>
          <Link
            href="/booking"
            className="mt-10 inline-block rounded-full bg-navy px-10 py-4 text-lg font-semibold text-cream shadow-xl transition-transform hover:scale-105"
          >
            Book Your Event →
          </Link>
        </div>
      </section>
    </main>
  );
}