// app/admin/settings/page.tsx
// Admin settings — edit bank details, contact info, tagline.
// Changes here affect what clients see on the public site.

"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { getSettings, updateSettings } from "@/lib/actions";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state — all fields
  const [form, setForm] = useState({
    bank_name: "",
    account_name: "",
    account_number: "",
    deposit_amount: "",
    phone: "",
    email: "",
    email_alt: "",
    address: "",
    tagline: "",
  });

  // On mount: verify login, then load current settings
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const data = await getSettings();
      if (data) {
        setForm({
          bank_name: data.bank_name ?? "",
          account_name: data.account_name ?? "",
          account_number: data.account_number ?? "",
          deposit_amount: data.deposit_amount ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          email_alt: data.email_alt ?? "",
          address: data.address ?? "",
          tagline: data.tagline ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updateSettings(form);
    setSaving(false);

    if (!result.success) {
      setError(result.error ?? "Failed to save.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-navy/60">Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      <AdminHeader />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Bank details */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-navy">
              🏦 Bank Details
            </h2>
            <p className="mt-1 text-sm text-navy/60">
              Used internally for reference — not shown on the public site.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Bank Name"
                value={form.bank_name}
                onChange={(v) => setForm({ ...form, bank_name: v })}
                placeholder="GTBank"
              />
              <Field
                label="Account Name"
                value={form.account_name}
                onChange={(v) => setForm({ ...form, account_name: v })}
                placeholder="Baseline Event Centre Ltd"
              />
              <Field
                label="Account Number"
                value={form.account_number}
                onChange={(v) => setForm({ ...form, account_number: v })}
                placeholder="0123456789"
              />
              <Field
                label="Default Caution Fee (display)"
                value={form.deposit_amount}
                onChange={(v) => setForm({ ...form, deposit_amount: v })}
                placeholder="₦100,000"
              />
            </div>
          </section>

          {/* Contact info */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-navy">
              📞 Contact Information
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="0812 667 1066"
              />
              <Field
                label="Primary Email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="info@baselineeventcentre.com"
              />
              <Field
                label="Secondary Email (optional)"
                value={form.email_alt}
                onChange={(v) => setForm({ ...form, email_alt: v })}
                placeholder="baselineeventcenter@gmail.com"
              />
              <div className="md:col-span-2">
                <Field
                  label="Address"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                  placeholder="8 Gaga Road, Off Idanre Garage, Oke-Aro, Ondo State"
                />
              </div>
            </div>
          </section>

          {/* Branding */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-semibold text-navy">
              ✨ Branding
            </h2>
            <div className="mt-4">
              <Field
                label="Tagline"
                value={form.tagline}
                onChange={(v) => setForm({ ...form, tagline: v })}
                placeholder="Your Event, Our Priority"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {saved && (
            <div className="rounded-lg bg-green-100 p-3 text-sm text-green-800">
              ✓ Saved! Changes will show on the public site.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-gold py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </main>
  );
}

// ---------- Small helper component ----------
function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-navy/60">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-navy/20 px-4 py-3 focus:border-gold focus:outline-none"
      />
    </div>
  );
}