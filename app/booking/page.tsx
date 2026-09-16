// app/booking/page.tsx
// The booking page. 3 parts:
//   1. Calendar (green = free, red = booked)
//   2. Booking form (name, email, phone, event type)
//   3. Bank details (shown after form submission)
//
// For now, everything is client-side only. Backend wires up tomorrow.

"use client";

import { useState } from "react";

// ---------- FAKE DATA (replaced by Supabase tomorrow) ----------
// Pretend these dates are already booked by offline clients.
// Format: YYYY-MM-DD
const BOOKED_DATES = [
  "2026-10-04",
  "2026-10-11",
  "2026-10-18",
  "2026-10-25",
  "2026-11-08",
  "2026-11-22",
  "2026-12-14",
  "2026-12-25",
  "2026-12-31",
];

// The client's bank details. These show after booking submission.
const BANK_DETAILS = {
  bank: "GTBank",
  accountName: "Baseline Events Center Ltd",
  accountNumber: "0123456789",
  depositAmount: "₦100,000",
};

// ---------- THE PAGE ----------
export default function BookingPage() {
  // Which month are we viewing? Defaults to today's month.
  const [viewDate, setViewDate] = useState(new Date());
  // Which date did the client pick? null until they click one.
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Has the client submitted the form yet?
  const [submitted, setSubmitted] = useState(false);

  // Helper: format a Date object as "YYYY-MM-DD" (matches our booked dates)
  const toKey = (d: Date) => d.toISOString().split("T")[0];

  // Build the calendar grid for the current viewDate
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty cells before day 1 so the grid lines up with the weekday row
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...blanks, ...days];

  const monthName = viewDate.toLocaleString("en-US", { month: "long" });

  // Move forward / backward a month
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // When the form is submitted, flip to the "bank details" view
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-cream py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Page heading */}
        <div className="text-center">
          <h1 className="font-heading text-5xl font-bold text-plum">
            Book Your Date
          </h1>
          <p className="mt-3 text-plum/70">
            Pick an available date, fill in your details, and lock it in.
          </p>
        </div>

        {/* ---------- CALENDAR ---------- */}
        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg md:p-10">
          {/* Month navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="rounded-full border border-plum/20 px-4 py-2 text-sm hover:bg-plum hover:text-cream"
            >
              ← Prev
            </button>
            <h2 className="font-heading text-2xl font-semibold text-plum">
              {monthName} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="rounded-full border border-plum/20 px-4 py-2 text-sm hover:bg-plum hover:text-cream"
            >
              Next →
            </button>
          </div>

          {/* Weekday header row */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-plum/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              // Empty cell (blank before day 1)
              if (day === null) {
                return <div key={`blank-${i}`} />;
              }

              // Build this day's key in "YYYY-MM-DD" format
              const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isBooked = BOOKED_DATES.includes(key);
              const isSelected = selectedDate === key;

              // Days before today can't be booked
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const thisDay = new Date(year, month, day);
              const isPast = thisDay < today;

              return (
                <button
                  key={key}
                  disabled={isBooked || isPast}
                  onClick={() => setSelectedDate(key)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${isPast ? "text-plum/20 cursor-not-allowed" : ""}
                    ${isBooked ? "bg-red-100 text-red-400 line-through cursor-not-allowed" : ""}
                    ${!isBooked && !isPast && !isSelected ? "bg-green-50 text-green-800 hover:bg-green-100" : ""}
                    ${isSelected ? "bg-accent text-white shadow-md scale-105" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-plum/60">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-green-50 border border-green-200" />
              Available
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-red-100 border border-red-200" />
              Booked
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-accent" />
              Your pick
            </div>
          </div>
        </div>

        {/* ---------- FORM OR BANK DETAILS ---------- */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl bg-white p-6 shadow-lg md:p-10"
          >
            <h2 className="font-heading text-2xl font-semibold text-plum">
              Your Details
            </h2>
            <p className="mt-2 text-sm text-plum/60">
              {selectedDate
                ? `Selected date: ${selectedDate}`
                : "Pick a date above first."}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                required
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone number"
                required
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <select
                required
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              >
                <option value="">Type of event</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate Event</option>
                <option>Conference</option>
                <option>Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedDate}
              className="mt-8 w-full rounded-full bg-accent py-4 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {selectedDate ? "Continue to Payment →" : "Select a date first"}
            </button>
          </form>
        ) : (
          // ---------- BANK DETAILS (shown after submission) ----------
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg md:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>
              <h2 className="mt-4 font-heading text-3xl font-bold text-plum">
                Almost Done
              </h2>
              <p className="mt-2 text-plum/70">
                Transfer the deposit to the account below. We&apos;ll confirm
                your booking once payment is received.
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-xl bg-cream p-6">
              <div className="flex justify-between border-b border-plum/10 pb-3">
                <span className="text-plum/60">Date selected</span>
                <span className="font-semibold text-plum">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b border-plum/10 pb-3">
                <span className="text-plum/60">Bank</span>
                <span className="font-semibold text-plum">{BANK_DETAILS.bank}</span>
              </div>
              <div className="flex justify-between border-b border-plum/10 pb-3">
                <span className="text-plum/60">Account name</span>
                <span className="font-semibold text-plum">
                  {BANK_DETAILS.accountName}
                </span>
              </div>
              <div className="flex justify-between border-b border-plum/10 pb-3">
                <span className="text-plum/60">Account number</span>
                <span className="font-mono text-lg font-bold text-accent">
                  {BANK_DETAILS.accountNumber}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-plum/60">Deposit required</span>
                <span className="font-semibold text-plum">
                  {BANK_DETAILS.depositAmount}
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-plum/60">
              After payment, you&apos;ll receive a confirmation by email within a
              few hours.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedDate(null);
              }}
              className="mt-6 w-full rounded-full border border-plum/20 py-3 text-sm text-plum/70 hover:bg-plum hover:text-cream"
            >
              ← Start over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}