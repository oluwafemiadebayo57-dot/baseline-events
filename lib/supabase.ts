// lib/supabase.ts
// Creates two Supabase clients:
//   - supabase: for browser/component use with the PUBLIC key (safe)
//   - supabaseAdmin: for server-side admin actions with the SECRET key
//
// The public one can only do what RLS policies allow.
// The admin one bypasses RLS — use ONLY in server code, never in components.

import { createClient } from "@supabase/supabase-js";

// Read from .env.local — these are available at build time.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — safe to use in any component.
// Can only insert bookings, read blocked dates, read settings.
// CANNOT read other bookings or update anything.
export const supabase = createClient(url, anonKey);

// Admin client — bypasses RLS, full access to everything.
// ONLY import this in server code (API routes, server actions).
// NEVER import this in a "use client" component — it would leak the secret.
export function getAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY!;
  return createClient(url, secret, {
    auth: { persistSession: false },
  });
}