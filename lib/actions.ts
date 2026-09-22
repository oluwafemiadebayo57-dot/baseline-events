// lib/actions.ts
// Server Actions — functions that run on the server, not the browser.
// This is where we safely write to the database and send emails.

"use server";

import { Resend } from "resend";
import { getAdminClient } from "./supabase";

// Initialize Resend with the API key from env.
const resend = new Resend(process.env.RESEND_API_KEY);

// Where notifications go
const ADMIN_EMAILS = [
  process.env.NOTIFICATION_EMAIL,
  process.env.OWNER_EMAIL,
].filter(Boolean) as string[];

// Format a hall slug into a friendly name.
function hallName(slug: string) {
  return slug === "big-hall" ? "The Grand Ballroom" : "The Mini Ballroom";
}

// ---------- BOOKINGS ----------

// Save a new booking and send notification emails.
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

  const hall = hallName(formData.hall_slug);

  // Notify the admin(s). Don't fail the booking if email fails.
  try {
    await resend.emails.send({
      from: "Baseline Bookings <bookings@baselineeventcentre.com>",
      to: ADMIN_EMAILS,
      subject: `🔔 New Booking — ${hall} on ${formData.event_date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <h2 style="color: #0B1F3A; margin-bottom: 4px;">New Booking Received</h2>
          <p style="color: #666; margin-top: 0;">A new booking was just submitted.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 40%;">Hall</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${hall}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Date</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formData.event_date}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Client</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.name}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Phone</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.phone}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Email</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.email}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Event Type</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.event_type}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Status</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #E8543A; font-weight: 600;">PENDING — awaiting payment</td></tr>
          </table>

          <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
            <strong>Action required:</strong> Log in to your admin dashboard to confirm this booking after payment is received.
          </div>

          <p style="margin-top: 32px; color: #999; font-size: 12px;">— Baseline Event Centre Booking System</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Admin notification email failed:", err);
    // Do NOT return failure — booking already saved.
  }

  // Send confirmation to the client
  try {
    await resend.emails.send({
      from: "Baseline Event Centre <bookings@baselineeventcentre.com>",
      to: formData.email,
      subject: `Booking Request Received — ${hall}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <h2 style="color: #0B1F3A;">Thank you, ${formData.name}.</h2>
          <p>We've received your booking request for <strong>${hall}</strong>.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 40%;">Hall</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${hall}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Date</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formData.event_date}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Event</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.event_type}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Status</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #E8543A; font-weight: 600;">Awaiting deposit payment</td></tr>
          </table>

          <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
            <strong>Next step:</strong> Transfer the caution fee to the bank account shown on the website to lock in your date.
          </div>

          <p style="margin-top: 24px;">Once payment is confirmed, you'll receive a final confirmation email.</p>

          <p style="margin-top: 32px; color: #666;">Warm regards,<br/><strong>Baseline Event Centre</strong><br/>Your Event, Our Priority</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Client confirmation email failed:", err);
  }

  return { success: true };
}

// Read the settings row (bank details etc.)
export async function getSettings() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) {
    console.error("getSettings error:", error);
    return null;
  }
  return data;
}

// Get all booked dates (bookings + blocked dates).
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

// ---------- ADMIN AUTH ----------

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

// ---------- ADMIN DATA ----------

export async function getAllBookings() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("getAllBookings:", error);
  return data ?? [];
}

export async function getBlockedDates() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("*")
    .order("date", { ascending: true });
  if (error) console.error("getBlockedDates:", error);
  return data ?? [];
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

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

export async function signOut() {
  const supabase = getAdminClient();
  await supabase.auth.signOut();
}

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

// ---------- HALLS ----------

export async function getHalls() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("halls")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) console.error("getHalls:", error);
  return data ?? [];
}

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

// ---------- SETTINGS ----------

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