// app/contact/page.tsx
// Contact page — reads real info from the settings table.

import { getSettings } from "@/lib/actions";
import type { Metadata } from "next";

// Force Next.js to fetch fresh data on every request instead of caching
// the page at build time. Ensures settings changes appear immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — Visit Baseline Event Centre, Akure",
  description:
    "Visit Baseline Event Centre at 8 Gaga Road, Off Idanre Garage, Oke-Aro, Akure. Call 0812 667 1066, message us on WhatsApp, or book your event online.",
  keywords: [
    "contact Baseline Event Centre",
    "event centre Akure address",
    "event hall phone number Akure",
    "Baseline Event Centre location",
  ],
  openGraph: {
    title: "Contact Us — Baseline Event Centre, Akure",
    description:
      "Visit us at 8 Gaga Road, Off Idanre Garage, Oke-Aro, Akure. Call 0812 667 1066 or book online.",
    url: "https://www.baselineeventcentre.com/contact",
    siteName: "Baseline Event Centre",
    locale: "en_NG",
    type: "website",
  },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const phone = settings?.phone ?? "0812 667 1066";
  const email = settings?.email ?? "info@baselineeventcentre.com";
  const emailAlt =
    settings?.email_alt ?? "baselineeventcenter@gmail.com";
  const address =
    settings?.address ??
    "8 Gaga Road, Off Idanre Garage, Oke-Aro, Ondo State";

  // Build WhatsApp link from phone.
  // Strip everything except digits, then convert Nigerian 0-prefix to +234.
  const digits = phone.replace(/[^0-9]/g, "");
  const whatsapp = digits.startsWith("0") ? "234" + digits.slice(1) : digits;

  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-navy py-20 text-center text-cream">
        <div className="mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
            Get in Touch
          </p>
          <h1 className="font-heading text-5xl font-bold md:text-6xl">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="mt-6 text-lg text-cream/70">
            Questions about booking? We respond fast.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Address */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">📍</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
              Visit Us
            </h3>
            <p className="mt-3 text-sm text-navy/70">{address}</p>
          </div>

          {/* Phone */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">📞</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
              Call Us
            </h3>
            <a
              href={`tel:+${whatsapp}`}
              className="mt-3 block text-sm text-navy/70 hover:text-gold"
            >
              {phone}
            </a>
          </div>

          {/* Email — shows both primary and secondary */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">✉️</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
              Email Us
            </h3>
            <div className="mt-3 space-y-1">
              <a
                href={`mailto:${email}`}
                className="block text-sm text-navy/70 hover:text-gold break-words"
              >
                {email}
              </a>
              {emailAlt && emailAlt !== email && (
                <a
                  href={`mailto:${emailAlt}`}
                  className="block text-sm text-navy/70 hover:text-gold break-words"
                >
                  {emailAlt}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-12 rounded-2xl bg-navy p-10 text-center text-cream">
          <h2 className="font-heading text-3xl font-bold">Prefer to Chat?</h2>
          <p className="mt-3 text-cream/70">
            Message us on WhatsApp — we usually reply within minutes.
          </p>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        {/* Social Media */}
        <div className="mt-16">
          <h2 className="text-center font-heading text-3xl font-bold text-navy">
            Follow Us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-navy/70">
            See our latest events, setups, and behind-the-scenes.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/baselineeventcenter"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-3xl text-white">
                📷
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
                Instagram
              </h3>
              <p className="mt-1 text-sm text-navy/60">
                @baselineeventcenter
              </p>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/baselineeventcentre"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] text-3xl font-bold text-white">
                f
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
                Facebook
              </h3>
              <p className="mt-1 text-sm text-navy/60">
                Baseline Event Centre
              </p>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@baseline.event.ce"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-3xl text-white">
                ♪
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-navy">
                TikTok
              </h3>
              <p className="mt-1 text-sm text-navy/60">
                @baseline.event.ce
              </p>
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-16 overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.1302602895785!2d5.1699800749993665!3d7.225979992780033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1047851c02b36ccf%3A0xc27e737dc6cd13d6!2sBaseline%20Event%20Center!5e0!3m2!1sen!2sng!4v1789752214682!5m2!1sen!2sng"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Baseline Event Centre location"
          />
        </div>

        {/* Visit CTA */}
        <div className="mt-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-navy">
            Want to see it in person?
          </h2>
          <p className="mt-3 text-navy/70">
            Book a viewing, or check availability online right now.
          </p>
          <a
            href="/booking"
            className="mt-6 inline-block rounded-full bg-gold px-8 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
          >
            Check Available Dates →
          </a>
        </div>
      </section>
    </main>
  );
}