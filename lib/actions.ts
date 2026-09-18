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
  hall_slug: string;
}) {
  const supabase = getAdminClient();

  const { error } = await supabase.from("bookings").insert({
    event_date: formData.event_date,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    event_type: formData.event_type,
    hall_slug: formData.hall_slug,
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

  const { data: bookings, error: e1 } = await supabase
    .from("bookings")
    .select("event_date")
    .in("status", ["pending", "confirmed"]);

  const { data: blocked, error: e2 } = await supabase
    .from("blocked_dates")
    .select("date");

  if (e1) console.error("bookings fetch error:", e1);
  if (e2) console.error("blocked fetch error:", e2);

  const dates = [
    ...(bookings ?? []).map((b) => b.event_date),
    ...(blocked ?? []).map((b) => b.date),
  ];

  return Array.from(new Set(dates));
}

// Check if the currently logged-in user is an admin.
export async function checkAdmin() {
  const supabase = getAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

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

  const { data: existing } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("date", date)
    .maybeSingle();

  if (existing) {
    await supabase.from("blocked_dates").delete().eq("id", existing.id);
    return { success: true, action: "unblocked" };
  }

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
export async function createAdminBooking(formData: {
  event_date: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  hall_slug: string;
  notes?: string;
}) {
  const supabase = getAdminClient();

  const { error } = await supabase.from("bookings").insert({
    event_date: formData.event_date,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    event_type: formData.event_type,
    hall_slug: formData.hall_slug,
    notes: formData.notes ?? null,
    status: "confirmed",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Get all halls, ordered by display_order.
export async function getHalls() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("halls")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) console.error("getHalls:", error);
  return data ?? [];
}

// Get a single hall by its slug (e.g. 'big-hall').
export async function getHallBySlug(slug: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("halls")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) console.error("getHallBySlug:", error);
  return data;
}

// Get booked dates for a SPECIFIC hall only.
export async function getBookedDatesForHall(hallSlug: string): Promise<string[]> {
  const supabase = getAdminClient();

  const { data: bookings, error: e1 } = await supabase
    .from("bookings")
    .select("event_date")
    .eq("hall_slug", hallSlug)
    .in("status", ["pending", "confirmed"]);

  const { data: blocked, error: e2 } = await supabase
    .from("blocked_dates")
    .select("date");

  if (e1) console.error("bookings fetch:", e1);
  if (e2) console.error("blocked fetch:", e2);

  const dates = [
    ...(bookings ?? []).map((b) => b.event_date),
    ...(blocked ?? []).map((b) => b.date),
  ];
  return Array.from(new Set(dates));
}
// Update the settings row.
// Only the fields we pass get updated.
export async function updateSettings(data: {
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  deposit_amount?: string;
  phone?: string;
  email?: string;
  address?: string;
  tagline?: string;
}) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("settings")
    .update(data)
    .eq("id", 1);
  if (error) return { success: false, error: error.message };
  return { success: true };
}