// components/Navbar.tsx
// The top navigation bar — appears on every page.
// "use client" is needed because we use useState (for the mobile menu).
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  // Controls whether the mobile menu is open or closed.
  const [open, setOpen] = useState(false);

  // The nav links. Kept in an array so we can loop over them
  // instead of typing each one twice (desktop + mobile).
  const links = [
    { href: "/",        label: "Home" },
    { href: "/about",   label: "About" },
    { href: "/booking", label: "Book Now" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-plum text-cream shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo / hall name — always links home */}
        <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
          Baseline <span className="text-accent">Events</span>
        </Link>

        {/* Desktop links — hidden on small screens */}
        <ul className="hidden gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm uppercase tracking-widest transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger button — only on small screens */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile dropdown menu — only shows when open is true */}
      {open && (
        <ul className="flex flex-col gap-4 bg-plum px-6 pb-6 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm uppercase tracking-widest hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}