// lib/supabase-browser.ts
// Browser-side Supabase client with cookie-based auth.
// Use this ONLY in client components that need auth (login page).

"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}