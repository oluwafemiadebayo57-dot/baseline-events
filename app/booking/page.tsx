// app/booking/page.tsx
// Booking page. Now wired to Supabase:
//   - Calendar reads real booked dates
//   - Form writes real bookings to the database

"use client";

import { useEffect, useState } from "react";
import { createBooking, getBookedDates } from "@/lib/actions";

// Placeholder bank details. We'll load the real ones in a later chunk.
const BANK_DETAILS = {
  bank: "GTBank",
  accountName: "Baseline Events Center Ltd",
  accountNumber: "0123456789",
  depositAmount: "₦100,000",
};

export default function BookingPage() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form field values
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
  });

  // Load booked dates when the page first mounts
  useEffect(() => {
    getBookedDates().then(setBookedDates).catch(console.error);
  }, []);

  const toKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...blanks, ...days];

  const monthName = viewDate.toLocaleString("en-US", { month: "long" });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    const result = await createBooking({
      event_date: selectedDate,
      ...form,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-cream py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h1 className="font-heading text-5xl font-bold text-plum">
            Book Your Date
          </h1>
          <p className="mt-3 text-plum/70">
            Pick an available date, fill in your details, and lock it in.
          </p>
        </div>

        {/* CALENDAR */}
        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg md:p-10">
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

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-plum/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`blank-${i}`} />;

              const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isBooked = bookedDates.includes(key);
              const isSelected = selectedDate === key;

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

        {/* FORM OR CONFIRMATION */}
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border border-plum/20 px-4 py-3 focus:border-accent focus:outline-none"
              />
              <select
                required
                value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
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

            {error && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedDate || loading}
              className="mt-8 w-full rounded-full bg-accent py-4 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Saving..."
                : selectedDate
                  ? "Continue to Payment →"
                  : "Select a date first"}
            </button>
          </form>
        ) : (
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
                setForm({ name: "", email: "", phone: "", event_type: "" });
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