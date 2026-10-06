// app/admin/page.tsx
// Admin dashboard — the owner's control panel.

"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  getAllBookings,
  updateBookingStatus,
  getBlockedDates,
  toggleBlockedDate,
  createAdminBooking,
  deleteBooking,
  restoreBooking,
} from "@/lib/actions";

type Booking = {
  id: string;
  created_at: string;
  event_date: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  hall_slug: string | null;
  status: "pending" | "confirmed" | "cancelled";
};

type FilterTab = "all" | "pending" | "confirmed" | "cancelled";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<{ id: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [addForm, setAddForm] = useState({
    event_date: "",
    name: "",
    email: "",
    phone: "",
    event_type: "",
    hall_slug: "big-hall",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      await refresh();
      setLoading(false);
    })();
  }, []);

  async function refresh() {
    const [b, bd] = await Promise.all([getAllBookings(), getBlockedDates()]);
    setBookings(b as Booking[]);
    setBlocked(bd as { id: string; date: string }[]);
  }

  async function handleConfirm(id: string) {
    await updateBookingStatus(id, "confirmed");
    await refresh();
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking? The date will free up.")) return;
    await updateBookingStatus(id, "cancelled");
    await refresh();
  }

  async function handleRestore(id: string) {
    if (!confirm("Restore this booking? It will be set back to pending.")) return;
    await restoreBooking(id);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Permanently delete this booking? This cannot be undone."
      )
    )
      return;
    await deleteBooking(id);
    await refresh();
  }

  async function handleUnblock(id: string) {
    const b = blocked.find((x) => x.id === id);
    if (!b) return;
    await toggleBlockedDate(b.date);
    await refresh();
  }

  async function handleAddBooking(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await createAdminBooking(addForm);
    setSaving(false);
    if (!result.success) {
      alert("Error: " + result.error);
      return;
    }
    setShowAddForm(false);
    setAddForm({
      event_date: "",
      name: "",
      email: "",
      phone: "",
      event_type: "",
      hall_slug: "big-hall",
      notes: "",
    });
    await refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-navy/60">Loading dashboard...</p>
      </main>
    );
  }

  // Filtered bookings based on active tab
  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "all") return b.status !== "cancelled";
    return b.status === filterTab;
  });

  // Counts per status
  const counts = {
    all: bookings.filter((b) => b.status !== "cancelled").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Active" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <main className="min-h-screen bg-cream">
      <AdminHeader />

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-gold">
              {counts.pending}
            </div>
            <div className="mt-1 text-sm text-navy/60">Pending</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">
              {counts.confirmed}
            </div>
            <div className="mt-1 text-sm text-navy/60">Confirmed</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-navy">{blocked.length}</div>
            <div className="mt-1 text-sm text-navy/60">Blocked Dates</div>
          </div>
        </div>

        {/* Bookings list */}
        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-navy">
                Bookings
              </h2>
              <p className="mt-1 text-sm text-navy/60">
                Confirm bookings after payment is received.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-cream hover:opacity-90"
            >
              {showAddForm ? "✕ Cancel" : "+ Add Booking"}
            </button>
          </div>

          {/* Filter tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-b border-navy/10">
            {tabs.map((tab) => {
              const active = filterTab === tab.key;
              const count = counts[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`relative -mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "border-gold text-navy"
                      : "border-transparent text-navy/50 hover:text-navy"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      active ? "bg-gold text-navy" : "bg-navy/10 text-navy/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add booking form */}
          {showAddForm && (
            <form
              onSubmit={handleAddBooking}
              className="mt-6 rounded-2xl bg-white p-6 shadow-md"
            >
              <h3 className="font-heading text-lg font-semibold text-navy">
                New Booking (offline client)
              </h3>
              <p className="mt-1 text-xs text-navy/60">
                For walk-in or phone bookings. Saves as confirmed.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  type="date"
                  required
                  value={addForm.event_date}
                  onChange={(e) =>
                    setAddForm({ ...addForm, event_date: e.target.value })
                  }
                  className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Client name"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  required
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                />
                <select
                  required
                  value={addForm.hall_slug}
                  onChange={(e) =>
                    setAddForm({ ...addForm, hall_slug: e.target.value })
                  }
                  className="rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                >
                  <option value="big-hall">The Grand Ballroom</option>
                  <option value="small-hall">The Mini Ballroom</option>
                </select>
                <select
                  required
                  value={addForm.event_type}
                  onChange={(e) =>
                    setAddForm({ ...addForm, event_type: e.target.value })
                  }
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
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={addForm.notes}
                    onChange={(e) =>
                      setAddForm({ ...addForm, notes: e.target.value })
                    }
                    className="w-full rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 rounded-full bg-gold px-8 py-3 font-semibold text-navy shadow-lg hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Booking"}
              </button>
            </form>
          )}

          {/* Bookings */}
          {filteredBookings.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-10 text-center text-navy/50 shadow-sm">
              {filterTab === "cancelled"
                ? "No cancelled bookings."
                : filterTab === "pending"
                  ? "No pending bookings."
                  : filterTab === "confirmed"
                    ? "No confirmed bookings."
                    : "No bookings yet."}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-lg font-semibold text-navy">
                          {b.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            b.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : b.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {b.status}
                        </span>
                        {b.hall_slug && (
                          <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">
                            {b.hall_slug === "big-hall"
                              ? "The Grand Ballroom"
                              : "The Mini Ballroom"}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-navy/70 sm:grid-cols-2">
                        <div>📅 Event: <strong>{b.event_date}</strong></div>
                        <div>🎉 Type: {b.event_type}</div>
                        <div>✉️ {b.email || "—"}</div>
                        <div>📞 {b.phone}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleConfirm(b.id)}
                            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy hover:opacity-90"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                      {b.status === "cancelled" && (
                        <>
                          <button
                            onClick={() => handleRestore(b.id)}
                            className="rounded-full border border-navy/20 px-4 py-2 text-sm text-navy hover:bg-navy hover:text-cream"
                          >
                            ↺ Restore
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                          >
                            🗑 Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Blocked dates */}
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold text-navy">
            Blocked Dates
          </h2>
          <p className="mt-1 text-sm text-navy/60">
            Dates blocked manually (offline bookings, maintenance, etc.)
          </p>

          {blocked.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-navy/50 shadow-sm">
              No blocked dates yet.
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap gap-2">
              {blocked.map((bd) => (
                <button
                  key={bd.id}
                  onClick={() => handleUnblock(bd.id)}
                  className="group flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm text-red-800 hover:bg-red-200"
                  title="Click to unblock"
                >
                  {bd.date}
                  <span className="text-xs opacity-50 group-hover:opacity-100">
                    ✕
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}