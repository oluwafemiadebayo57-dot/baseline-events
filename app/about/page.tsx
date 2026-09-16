// app/about/page.tsx
// The About page. Tells the story of Baseline Events Center.

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-plum py-20 text-center text-cream">
        <h1 className="font-heading text-5xl font-bold md:text-6xl">
          About <span className="text-accent">Baseline</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl px-6 text-cream/70">
          A space built for moments that matter.
        </p>
      </section>

      {/* Story section */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=80"
            alt="Baseline Events Center"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-heading text-4xl font-bold text-plum">
            A Hall That Feels Like Home
          </h2>
          <div className="mt-6 space-y-4 text-plum/80">
            <p>
              Baseline Events Center is Akure&apos;s premier destination for
              weddings, birthdays, corporate events, and celebrations of every
              kind. With space for up to 1,000 guests, an elegant lounge, and a
              dedicated team, we&apos;ve hosted some of the city&apos;s most
              memorable moments.
            </p>
            <p>
              We believe booking a venue should be as easy as the event itself.
              That&apos;s why we built an online booking system — so you can
              check availability, reserve your date, and confirm in minutes.
              No endless phone calls. No back-and-forth. Just book.
            </p>
            <p>
              Whether it&apos;s an intimate gathering or a grand celebration,
              Baseline is ready to make it unforgettable.
            </p>
          </div>

          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            Check Availability →
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 text-center md:grid-cols-3">
          {[
            { number: "1,000", label: "Guest Capacity" },
            { number: "500+", label: "Events Hosted" },
            { number: "5★", label: "Client Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-5xl font-bold text-accent">
                {stat.number}
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-plum/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}