// lib/actions.ts
// Server Actions — functions that run on the server, not the browser.
// This is where we safely write to the database.

"use server";

import { getAdminClient } from "./supabase";

// Save a new booking. Called when the client submits the form.
export async function createBooking(formData: {
  event_date: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
}) {
  const supabase = getAdminClient();

  const { error } = await supabase.from("bookings").insert({
    event_date: formData.event_date,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    event_type: formData.event_type,
    status: "pending",
  });

  if (error) {
    console.error("createBooking error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Read the settings row (bank details).
export async function getSettings() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) {
    console.error("getSettings error:", error);
    return null;
  }
  return data;
}

// Get all booked dates (bookings + blocked dates) so the calendar can
// show green/red. Called by the booking page.
export async function getBookedDates(): Promise<string[]> {
  const supabase = getAdminClient();

  // Bookings that are pending or confirmed (ignore cancelled)
  const { data: bookings, error: e1 } = await supabase
    .from("bookings")
    .select("event_date")
    .in("status", ["pending", "confirmed"]);

  // Manually blocked dates
  const { data: blocked, error: e2 } = await supabase
    .from("blocked_dates")
    .select("date");

  if (e1) console.error("bookings fetch error:", e1);
  if (e2) console.error("blocked fetch error:", e2);

  const dates = [
    ...(bookings ?? []).map((b) => b.event_date),
    ...(blocked ?? []).map((b) => b.date),
  ];

  // Deduplicate
  return Array.from(new Set(dates));
}
// Check if the currently logged-in user is an admin.
// Returns the user object if yes, null if not logged in or not an admin.
export async function checkAdmin() {
  const supabase = getAdminClient();

  // Get the currently logged-in user via Supabase's built-in auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Look up whether this user is in the admins table
  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ? user : null;
}

// Get all bookings, newest first.
export async function getAllBookings() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("getAllBookings:", error);
  return data ?? [];
}

// Get all manually blocked dates.
export async function getBlockedDates() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("date", { ascending: true });
  if (error) console.error("getBlockedDates:", error);
  return data ?? [];
}

// Change a booking's status (pending → confirmed, or → cancelled).
export async function updateBookingStatus(id: string, status: string) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Block or unblock a date manually.
export async function toggleBlockedDate(date: string, reason?: string) {
  const supabase = getAdminClient();

  // Check if it's already blocked
  const { data: existing } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (existing) {
    // Un-block it
    await supabase.from("blocked_dates").delete().eq("id", existing.id);
    return { success: true, action: "unblocked" };
  }

  // Block it
  const { error } = await supabase
    .from("blocked_dates")
    .insert({ date, reason: reason ?? null });
  if (error) return { success: false, error: error.message };
  return { success: true, action: "blocked" };
}

// Sign out the current user.
export async function signOut() {
  const supabase = getAdminClient();
  await supabase.auth.signOut();
}
// Create a booking from the admin panel (offline/walk-in client).
// Same as createBooking, but marks it as already confirmed.
export async function createAdminBooking(formData: {
  event_date: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  notes?: string;
}) {
  const supabase = getAdminClient();

  const { error } = await supabase.from("bookings").insert({
    event_date: formData.event_date,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    event_type: formData.event_type,
    notes: formData.notes ?? null,
    status: "confirmed", // admin-created bookings are already confirmed
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}