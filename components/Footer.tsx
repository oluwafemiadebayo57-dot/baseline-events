// components/Footer.tsx
// The bottom of every page. Dark navy background, contact info, quick links.

import Link from "next/link";

export default function Footer() {
  // Quick links — same idea as the navbar, listed once here.
  const links = [
    { href: "/",        label: "Home" },
    { href: "/about",   label: "About" },
    { href: "/booking", label: "Book Now" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Column 1: brand + tagline */}
        <div>
          <h3 className="font-heading text-2xl font-bold">
            Baseline <span className="text-gold">Events</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Premium event hall and lounge for weddings, birthdays, and
            corporate events. Book online, in minutes.
          </p>
        </div>

        {/* Column 2: quick links */}
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

        {/* Column 3: contact info — placeholder values for now */}
        <div>
          <h4 className="font-heading text-lg font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>📍 123 Example Road, Your City</li>
            <li>📞 +234 800 000 0000</li>
            <li>✉️ hello@baselineevents.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar — copyright */}
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Baseline Events Center. All rights reserved.
      </div>
    </footer>
  );
}