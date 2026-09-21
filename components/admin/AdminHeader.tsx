// components/admin/AdminHeader.tsx
// Shared header for admin pages — shows tabs + actions.
// Used by: /admin and /admin/settings

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // The tabs shown on every admin page
  const tabs = [
    { href: "/admin",          label: "Dashboard" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="border-b border-navy/10 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Top row: title + actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-navy">
              Baseline Event Centre
            </h1>
            <p className="mt-1 text-sm text-navy/60">Admin Panel</p>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy/20 px-5 py-2 text-sm hover:bg-navy hover:text-cream"
            >
              View Website ↗
            </a>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-navy/20 px-5 py-2 text-sm hover:bg-navy hover:text-cream"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Bottom row: tabs */}
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-t-lg border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "border-gold text-navy"
                    : "border-transparent text-navy/50 hover:text-navy"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}