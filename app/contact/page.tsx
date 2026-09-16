// app/contact/page.tsx
// Contact page — address, phone, email, and WhatsApp button.

export default function ContactPage() {
  // Contact info — replace these with the client's real details when he sends them.
  const contact = {
    address: "123 Example Road, Akure, Ondo State",
    phone: "+234 800 000 0000",
    email: "hello@baselineevents.com",
    whatsapp: "2348000000000", // no + sign, no spaces
  };

  return (
    <main className="bg-cream">
      {/* Header */}
      <section className="bg-plum py-20 text-center text-cream">
        <h1 className="font-heading text-5xl font-bold md:text-6xl">
          Get in <span className="text-accent">Touch</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl px-6 text-cream/70">
          Questions about booking? Reach us — we respond fast.
        </p>
      </section>

      {/* Contact cards */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Address */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">📍</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-plum">
              Visit Us
            </h3>
            <p className="mt-3 text-sm text-plum/70">{contact.address}</p>
          </div>

          {/* Phone */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">📞</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-plum">
              Call Us
            </h3>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="mt-3 block text-sm text-plum/70 hover:text-accent"
            >
              {contact.phone}
            </a>
          </div>

          {/* Email */}
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
            <div className="text-4xl">✉️</div>
            <h3 className="mt-4 font-heading text-xl font-semibold text-plum">
              Email Us
            </h3>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 block text-sm text-plum/70 hover:text-accent"
            >
              {contact.email}
            </a>
          </div>
        </div>

        {/* WhatsApp CTA — the big one for Nigerian clients */}
        <div className="mt-12 rounded-2xl bg-purple p-10 text-center text-plum">
          <h2 className="font-heading text-3xl font-bold">
            Prefer to Chat?
          </h2>
          <p className="mt-3 text-plum/70">
            Message us on WhatsApp — we usually reply within minutes.
          </p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            💬 Chat on WhatsApp
          </a>
        </div>

        {/* Simple map placeholder */}
        <div className="mt-12 overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src="https://www.google.com/maps?q=Akure,Nigeria&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}