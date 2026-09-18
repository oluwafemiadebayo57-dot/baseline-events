// app/booking/page.tsx
// Multi-hall booking flow:
//   1. Pick a hall
//   2. Pick a date from that hall's calendar
//   3. Fill in details
//   4. See that hall's price + bank details

"use client";

import { useEffect, useState } from "react";
import {
  createBooking,
  getBookedDatesForHall,
  getHalls,
} from "@/lib/actions";

type Hall = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  capacity_conf: number;
  capacity_banq: number;
  rental_price: number;
  caution_fee: number;
  facilities: string[];
};

// Placeholder bank details — will be editable from admin later
const BANK_DETAILS = {
  bank: "GTBank",
  accountName: "Baseline Event Centre Ltd",
  accountNumber: "0123456789",
};

// Format numbers with commas: 3500000 → 3,500,000
const fmt = (n: number) => n.toLocaleString("en-NG");

export default function BookingPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
  });

  // Load all halls on mount
  useEffect(() => {
    getHalls().then((h) => setHalls(h as Hall[])).catch(console.error);
  }, []);

  // When a hall is selected, load ITS booked dates
  useEffect(() => {
    if (!selectedHall) {
      setBookedDates([]);
      return;
    }
    getBookedDatesForHall(selectedHall.slug)
      .then(setBookedDates)
      .catch(console.error);
  }, [selectedHall]);

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
    if (!selectedDate || !selectedHall) return;

    setLoading(true);
    setError(null);

    const result = await createBooking({
      event_date: selectedDate,
      hall_slug: selectedHall.slug,
      ...form,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setSubmitted(true);
  };

  // ---------- VIEW: SUCCESS ----------
  if (submitted && selectedHall) {
    return (
      <main className="min-h-screen bg-cream py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✓
              </div>
              <h2 className="mt-4 font-heading text-3xl font-bold text-navy">
                Almost Done
              </h2>
              <p className="mt-2 text-navy/70">
                Transfer the caution fee to secure {selectedHall.name}.
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-xl bg-cream p-6">
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Hall</span>
                <span className="font-semibold text-navy">{selectedHall.name}</span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Date</span>
                <span className="font-semibold text-navy">{selectedDate}</span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Rental price</span>
                <span className="font-semibold text-navy">
                  ₦{fmt(selectedHall.rental_price)}
                </span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Caution fee to pay now</span>
                <span className="font-semibold text-gold text-lg">
                  ₦{fmt(selectedHall.caution_fee)}
                </span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Bank</span>
                <span className="font-semibold text-navy">{BANK_DETAILS.bank}</span>
              </div>
              <div className="flex justify-between border-b border-navy/10 pb-3">
                <span className="text-navy/60">Account name</span>
                <span className="font-semibold text-navy">
                  {BANK_DETAILS.accountName}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-navy/60">Account number</span>
                <span className="font-mono text-lg font-bold text-gold">
                  {BANK_DETAILS.accountNumber}
                </span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-navy/60">
              After payment, we&apos;ll confirm your booking and send you a
              receipt.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedDate(null);
                setSelectedHall(null);
                setForm({ name: "", email: "", phone: "", event_type: "" });
              }}
              className="mt-6 w-full rounded-full border border-navy/20 py-3 text-sm text-navy/70 hover:bg-navy hover:text-cream"
            >
              ← Book another event
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ---------- VIEW: BOOKING ----------
  return (
    <main className="min-h-screen bg-cream py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h1 className="font-heading text-5xl font-bold text-navy">
            Book Your Date
          </h1>
          <p className="mt-3 text-navy/70">
            Pick a hall, select your date, and lock it in.
          </p>
        </div>

        {/* STEP 1 — Pick a hall */}
        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-navy">
            1. Choose a hall
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {halls.map((hall) => {
              const active = selectedHall?.slug === hall.slug;
              return (
                <button
                  key={hall.id}
                  onClick={() => {
                    setSelectedHall(hall);
                    setSelectedDate(null);
                  }}
                  className={`rounded-2xl border-2 p-6 text-left transition-all ${
                    active
                      ? "border-gold bg-white shadow-lg"
                      : "border-navy/10 bg-white hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-bold text-navy">
                      {hall.name}
                    </h3>
                    {active && <span className="text-2xl text-gold">✓</span>}
                  </div>
                  <p className="mt-1 text-sm text-navy/60">{hall.tagline}</p>
                  <div className="mt-4 space-y-1 text-sm">
                    <div className="text-navy/80">
                      👥 Up to <strong>{fmt(hall.capacity_conf)}</strong> guests
                    </div>
                    <div className="text-navy/80">
                      💰 <strong>₦{fmt(hall.rental_price)}</strong> rental
                    </div>
                    <div className="text-navy/80">
                      🔒 <strong>₦{fmt(hall.caution_fee)}</strong> caution fee
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2 — Calendar (only shows when a hall is selected) */}
        {selectedHall && (
          <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg md:p-10">
            <h2 className="font-heading text-xl font-semibold text-navy">
              2. Pick an available date for {selectedHall.name}
            </h2>

            <div className="mt-6 mb-6 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-full border border-navy/20 px-4 py-2 text-sm hover:bg-navy hover:text-cream"
              >
                ← Prev
              </button>
              <h3 className="font-heading text-2xl font-semibold text-navy">
                {monthName} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="rounded-full border border-navy/20 px-4 py-2 text-sm hover:bg-navy hover:text-cream"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-navy/50">
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
                      ${isPast ? "text-navy/20 cursor-not-allowed" : ""}
                      ${isBooked ? "bg-red-100 text-red-400 line-through cursor-not-allowed" : ""}
                      ${!isBooked && !isPast && !isSelected ? "bg-green-50 text-green-800 hover:bg-green-100" : ""}
                      ${isSelected ? "bg-gold text-navy shadow-md scale-105" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-xs text-navy/60">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-green-50 border border-green-200" />
                Available
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-100 border border-red-200" />
                Booked
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-gold" />
                Your pick
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Form */}
        {selectedHall && selectedDate && (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl bg-white p-6 shadow-lg md:p-10"
          >
            <h2 className="font-heading text-xl font-semibold text-navy">
              3. Your details
            </h2>
            <p className="mt-1 text-sm text-navy/60">
              Booking <strong>{selectedHall.name}</strong> for{" "}
              <strong>{selectedDate}</strong>
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
              />
              <select
                required
                value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
              >
                <option value="">Type of event</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Conference</option>
                <option>Corporate Event</option>
                <option>Banquet</option>
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
              disabled={loading}
              className="mt-8 w-full rounded-full bg-gold py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue to Payment →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}