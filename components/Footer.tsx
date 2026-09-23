// components/Footer.tsx
// Site footer — reads contact info from settings dynamically.

import Link from "next/link";
import { getSettings } from "@/lib/actions";

export default async function Footer() {
  const settings = await getSettings();

  const phone = settings?.phone ?? "0812 667 1066";
  const email = settings?.email ?? "info@baselineeventcentre.com";
  const emailAlt =
    settings?.email_alt ?? "baselineeventcenter@gmail.com";
  const address =
    settings?.address ??
    "8 Gaga Road, Off Idanre Garage, Oke-Aro, Ondo State";

  // Convert Nigerian 0-prefix to +234 for WhatsApp
  const digits = phone.replace(/[^0-9]/g, "");
  const whatsapp = digits.startsWith("0") ? "234" + digits.slice(1) : digits;

  const links = [
    { href: "/",        label: "Home" },
    { href: "/halls",   label: "Halls" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about",   label: "About" },
    { href: "/booking", label: "Book Now" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="font-heading text-2xl font-bold">
            Baseline <span className="text-gold">Event Centre</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Two premium halls for weddings, conferences, banquets, and
            celebrations. Book online, in minutes.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cream/70 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — dynamic from settings */}
        <div>
          <h4 className="font-heading text-lg font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>📍 {address}</li>
            <li>
              📞{" "}
              <a href={`tel:+${whatsapp}`} className="hover:text-gold">
                {phone}
              </a>
            </li>
            <li>
              ✉️{" "}
              <a
                href={`mailto:${email}`}
                className="hover:text-gold break-words"
              >
                {email}
              </a>
            </li>
            {emailAlt && emailAlt !== email && (
              <li>
                ✉️{" "}
                <a
                  href={`mailto:${emailAlt}`}
                  className="hover:text-gold break-words"
                >
                  {emailAlt}
                </a>
              </li>
            )}
            <li>
              💬{" "}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Baseline Event Centre. All rights reserved.
      </div>
    </footer>
  );
}