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

// Save a new reservation and send notification emails.
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
      subject: `🔔 New Reservation — ${hall} on ${formData.event_date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <h2 style="color: #0B1F3A; margin-bottom: 4px;">New Reservation Received</h2>
          <p style="color: #666; margin-top: 0;">A new reservation was just submitted.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 40%;">Hall</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${hall}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Date</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formData.event_date}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Client</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.name}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Phone</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.phone}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Email</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.email}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Event Type</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.event_type}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Status</td><td style="padding: 12px; border-bottom: 1px solid #eee; color: #E8543A; font-weight: 600;">PENDING — awaiting contact</td></tr>
          </table>

          <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
            <strong>Action required:</strong> Contact the client to confirm availability. Log in to your admin dashboard to manage this reservation.
          </div>

          <p style="margin-top: 32px; color: #999; font-size: 12px;">— Baseline Event Centre Booking System</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Admin notification email failed:", err);
  }

  // Send confirmation to the client
  try {
    await resend.emails.send({
      from: "Baseline Event Centre <bookings@baselineeventcentre.com>",
      to: formData.email,
      subject: `Reservation Received — ${hall}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <h2 style="color: #0B1F3A;">Thank you, ${formData.name}.</h2>
          <p>We've received your reservation request for <strong>${hall}</strong>.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666; width: 40%;">Hall</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${hall}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Date</td><td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 600;">${formData.event_date}</td></tr>
            <tr><td style="padding: 12px; border-bottom: 1px solid #eee; color: #666;">Event</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.event_type}</td></tr>
          </table>

          <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
            <strong>What happens next:</strong> Our team will contact you shortly to confirm availability and discuss next steps. No action is needed from you right now.
          </div>

          <p style="margin-top: 32px; color: #666;">Warm regards,<br/><strong>Baseline Event Centre</strong><br/>Your Event, Our Priority</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Client confirmation email failed:", err);
  }

  return { success: true };
}

// Read the settings row.
export async function getSettings() {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from("settings").select("*").single();
  if (error) {
    console.error("getSettings error:", error);
    return null;
  }
  return data;
}

// Get all booked dates — ONLY confirmed bookings block a date.
// Pending reservations don't block (multiple people can request the same date).
export async function getBookedDates(): Promise<string[]> {
  const supabase = getAdminClient();

  const { data: bookings, error: e1 } = await supabase
    .from("bookings")
    .select("event_date")
    .eq("status", "confirmed");

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

// Change a booking's status and send the appropriate email to the client.
export async function updateBookingStatus(id: string, status: string) {
  const supabase = getAdminClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  if (status === "confirmed" || status === "cancelled") {
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (booking && booking.email) {
      const hall = hallName(booking.hall_slug);

      if (status === "confirmed") {
        await sendConfirmedEmail(booking, hall);
      } else if (status === "cancelled") {
        await sendCancelledEmail(booking, hall);
      }
    }
  }

  return { success: true };
}

// ---------- Email helpers for status changes ----------

async function sendConfirmedEmail(
  booking: {
    name: string;
    email: string;
    phone: string;
    event_date: string;
    event_type: string;
  },
  hall: string
) {
  try {
    await resend.emails.send({
      from: "Baseline Event Centre <bookings@baselineeventcentre.com>",
      to: booking.email,
      subject: `✅ Reservation Confirmed — ${hall} on ${booking.event_date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <div style="background: #0B1F3A; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-family: Georgia, serif; font-size: 24px;">Baseline Event Centre</h1>
          </div>

          <div style="padding: 32px 24px;">
            <h2 style="color: #0B1F3A; margin-top: 0;">Great news, ${booking.name}!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Your reservation at Baseline Event Centre is <strong style="color: #28a745;">confirmed</strong>. We look forward to hosting your event.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 28px; background: #FBF6EF; border-radius: 8px;">
              <tr><td style="padding: 14px 20px; color: #666; width: 40%;">Hall</td><td style="padding: 14px 20px; font-weight: 600;">${hall}</td></tr>
              <tr><td style="padding: 14px 20px; color: #666; border-top: 1px solid #eee;">Date</td><td style="padding: 14px 20px; font-weight: 600; border-top: 1px solid #eee;">${booking.event_date}</td></tr>
              <tr><td style="padding: 14px 20px; color: #666; border-top: 1px solid #eee;">Event Type</td><td style="padding: 14px 20px; border-top: 1px solid #eee;">${booking.event_type}</td></tr>
            </table>

            <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
              <strong style="color: #0B1F3A;">📍 Location:</strong>
              <p style="margin: 8px 0 0; color: #333;">8 Gaga Road, Off Idanre Garage, Oke-Aro, Ondo State</p>
            </div>

            <p style="margin-top: 28px; color: #333; font-size: 16px; line-height: 1.6;">
              If you have any questions or need to discuss arrangements, call us on <strong>0812 667 1066</strong> or simply reply to this email.
            </p>

            <p style="margin-top: 32px; color: #666;">
              Warm regards,<br/>
              <strong style="color: #0B1F3A;">Baseline Event Centre</strong><br/>
              <em style="color: #D4AF37;">Your Event, Our Priority</em>
            </p>
          </div>

          <div style="background: #FBF6EF; padding: 16px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 8px 8px;">
            © ${new Date().getFullYear()} Baseline Event Centre. All rights reserved.
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Confirmed email failed:", err);
  }
}

async function sendCancelledEmail(
  booking: {
    name: string;
    email: string;
    event_date: string;
  },
  hall: string
) {
  try {
    await resend.emails.send({
      from: "Baseline Event Centre <bookings@baselineeventcentre.com>",
      to: booking.email,
      subject: `Reservation Update — ${hall} on ${booking.event_date}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A;">
          <div style="background: #0B1F3A; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-family: Georgia, serif; font-size: 24px;">Baseline Event Centre</h1>
          </div>

          <div style="padding: 32px 24px;">
            <h2 style="color: #0B1F3A; margin-top: 0;">Hello ${booking.name},</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We're writing to let you know that your reservation for <strong>${hall}</strong> on <strong>${booking.event_date}</strong> has been cancelled.
            </p>

            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              If this is unexpected, or if you'd like to discuss alternative dates, please contact us as soon as possible:
            </p>

            <div style="margin-top: 28px; padding: 16px; background: #FBF6EF; border-left: 4px solid #D4AF37; border-radius: 4px;">
              <p style="margin: 0; color: #333;">📞 <strong>0812 667 1066</strong></p>
              <p style="margin: 8px 0 0; color: #333;">✉️ Reply to this email</p>
            </div>

            <p style="margin-top: 32px; color: #666;">
              We hope to have the opportunity to host your event in the future.<br/><br/>
              Warm regards,<br/>
              <strong style="color: #0B1F3A;">Baseline Event Centre</strong>
            </p>
          </div>

          <div style="background: #FBF6EF; padding: 16px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 8px 8px;">
            © ${new Date().getFullYear()} Baseline Event Centre. All rights reserved.
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Cancelled email failed:", err);
  }
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

// Get booked dates for a specific hall.
// ONLY confirmed bookings block the date.
export async function getBookedDatesForHall(hallSlug: string): Promise<string[]> {
  const supabase = getAdminClient();

  const { data: bookings, error: e1 } = await supabase
    .from("bookings")
    .select("event_date")
    .eq("hall_slug", hallSlug)
    .eq("status", "confirmed");

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
  email_alt?: string;
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