// app/gallery/page.tsx
// Full gallery — categorized images with lightbox.

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ---------- IMAGE CATEGORIES ----------
const CATEGORIES = [
  {
    slug: "grand-hall",
    title: "The Grand Hall",
    description:
      "Our flagship space — built for grand celebrations, weddings, and large conferences.",
    images: [
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986374/_MG_9986.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986386/_MG_9985.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986377/_MG_9943.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986400/_MG_9937.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986403/_MG_9982.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986404/_MG_9942.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986414/_MG_9948.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986424/_MG_0058.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986441/_MG_0054.jpg",
    ],
  },
  {
    slug: "facilities",
    title: "Facilities & Amenities",
    description:
      "Every detail covered — from executive restrooms to 24/7 standby power.",
    images: [
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986463/_MG_0010.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986462/_MG_0007.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986418/_MG_0065.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986394/_MG_9977.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986434/_MG_0049.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986370/_MG_9944.jpg",
    ],
  },
  {
    slug: "vip-lounge",
    title: "VIP & Lounge Areas",
    description:
      "Private spaces for hosts, guests of honour, and intimate moments.",
    images: [
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986423/_MG_0057.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789989180/_MG_0034.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986441/_MG_0036.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986452/_MG_0030.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986456/_MG_0028.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986457/_MG_0025.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986457/_MG_0027.jpg",
    ],
  },
  {
    slug: "exterior",
    title: "Exterior & Grounds",
    description:
      "Arrive in style — spacious parking, elegant compound, and a grand entrance.",
    images: [
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986465/_MG_0016.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986462/_MG_0019.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986407/_MG_0080.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986411/_MG_0077.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986399/_MG_0081.jpg",
      "https://res.cloudinary.com/izxlyyn5/image/upload/v1789986389/_MG_9968.jpg",
    ],
  },
];

// Hero image at the very top
const HERO_IMAGE =
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1789753151/OPT_6114.jpg";

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{
    categoryIndex: number;
    imageIndex: number;
  } | null>(null);

  const allImages = CATEGORIES.flatMap((cat) =>
    cat.images.map((url) => ({ url, category: cat.title }))
  );

  const currentImage = lightbox
    ? allImages[
        CATEGORIES.slice(0, lightbox.categoryIndex).reduce(
          (sum, cat) => sum + cat.images.length,
          0
        ) + lightbox.imageIndex
      ]
    : null;

  const currentIndex = lightbox
    ? CATEGORIES.slice(0, lightbox.categoryIndex).reduce(
        (sum, cat) => sum + cat.images.length,
        0
      ) + lightbox.imageIndex
    : 0;

  function openLightbox(categoryIndex: number, imageIndex: number) {
    setLightbox({ categoryIndex, imageIndex });
  }

  function closeLightbox() {
    setLightbox(null);
  }

  function nextImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!lightbox) return;
    const nextIndex = (currentIndex + 1) % allImages.length;
    let remaining = nextIndex;
    for (let c = 0; c < CATEGORIES.length; c++) {
      if (remaining < CATEGORIES[c].images.length) {
        setLightbox({ categoryIndex: c, imageIndex: remaining });
        return;
      }
      remaining -= CATEGORIES[c].images.length;
    }
  }

  function prevImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!lightbox) return;
    const prevIndex =
      (currentIndex - 1 + allImages.length) % allImages.length;
    let remaining = prevIndex;
    for (let c = 0; c < CATEGORIES.length; c++) {
      if (remaining < CATEGORIES[c].images.length) {
        setLightbox({ categoryIndex: c, imageIndex: remaining });
        return;
      }
      remaining -= CATEGORIES[c].images.length;
    }
  }

  return (
    <main className="bg-cream">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-navy py-32 text-center text-cream md:py-40">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Baseline Event Centre"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
            See It Before You Book
          </p>
          <h1 className="font-heading text-5xl font-bold md:text-6xl">
            The <span className="text-gold">Gallery</span>
          </h1>
          <p className="mt-6 text-lg text-cream/80">
            {allImages.length} photos across every corner of Baseline Event
            Centre.
          </p>
        </div>
      </section>

      {/* ============ IMAGE SECTIONS ============ */}
      {CATEGORIES.map((category, categoryIndex) => (
        <section
          key={category.slug}
          className={`py-20 ${
            categoryIndex % 2 === 0 ? "bg-cream" : "bg-white"
          }`}
        >
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-4xl font-bold text-navy md:text-5xl">
              {category.title}
            </h2>
            <p className="mt-3 max-w-2xl text-navy/70">
              {category.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.images.map((src, imageIndex) => (
                <button
                  key={src}
                  onClick={() => openLightbox(categoryIndex, imageIndex)}
                  className="group relative aspect-square overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-xl"
                >
                  <Image
                    src={src}
                    alt={`${category.title} — image ${imageIndex + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all group-hover:bg-navy/40 group-hover:opacity-100">
                    <span className="text-3xl text-cream">⤢</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ============ CTA ============ */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-heading text-4xl font-bold text-navy">
            Like what you see?
          </h2>
          <p className="mt-4 text-navy/70">
            Lock your date in minutes — online, no calls.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 font-semibold text-navy shadow-lg transition-transform hover:scale-105"
          >
            Book Your Date →
          </Link>
        </div>
      </section>

      {/* ============ LIGHTBOX ============ */}
      {lightbox && currentImage && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream/90 transition-colors hover:bg-cream/20"
            aria-label="Close"
          >
            ✕
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream/90 transition-colors hover:bg-cream/20 md:left-8 md:h-16 md:w-16"
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] w-full max-w-5xl"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={currentImage.url}
                alt={currentImage.category}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-sm text-cream/70">
              <span className="text-gold">{currentImage.category}</span>
              <span className="mx-2">·</span>
              {currentIndex + 1} / {allImages.length}
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-2xl text-cream/90 transition-colors hover:bg-cream/20 md:right-8 md:h-16 md:w-16"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}