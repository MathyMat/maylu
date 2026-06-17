import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";

const imageModules = import.meta.glob<{ default: string }>(
  "../assets/maylu/maylugaleria/*.{jpeg,jpg,png}",
  { eager: true },
);

const galleryImages = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => ({
    src: mod.default,
    alt:
      path
        .split(/[/\\]/)
        .pop()
        ?.replace(/\.[^.]+$/, "")
        .replace(/[_-]/g, " ") || "Foto de Maylu",
  }));

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería de Maylu" },
      {
        name: "description",
        content: "Fotos de Maylu, mi viringo peruano de 13 años.",
      },
      { property: "og:title", content: "Galería de Maylu" },
      {
        property: "og:description",
        content: "Momentos especiales de Maylu a lo largo de los años.",
      },
    ],
  }),
  component: Galeria,
});

function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Stagger animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (selected === null) return;
      if (e.key === "ArrowRight")
        setSelected((selected + 1) % galleryImages.length);
      if (e.key === "ArrowLeft")
        setSelected(
          (selected - 1 + galleryImages.length) % galleryImages.length,
        );
      if (e.key === "Escape") setSelected(null);
    },
    [selected],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || selected === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setSelected((selected + 1) % galleryImages.length);
      else
        setSelected(
          (selected - 1 + galleryImages.length) % galleryImages.length,
        );
    }
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="mx-auto max-w-2xl px-6 pt-12 pb-10 md:pt-16 md:pb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-cocoa tracking-tight">
          Galería de Maylu
        </h1>
        <p className="mt-3 text-base text-cocoa/50 leading-relaxed">
          Momentos especiales a lo largo de los años.
        </p>
      </section>

      {/* Masonry grid */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2.5">
          {galleryImages.map((img, i) => (
            <GalleryCard
              key={i}
              img={img}
              index={i}
              visible={visible}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/88 backdrop-blur-md"
          onClick={() => setSelected(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ animation: "lbFadeIn 0.18s ease" }}
        >
          <style>{`
            @keyframes lbFadeIn {
              from { opacity: 0 }
              to   { opacity: 1 }
            }
            @keyframes lbScale {
              from { opacity: 0; transform: scale(0.95) }
              to   { opacity: 1; transform: scale(1) }
            }
          `}</style>

          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow-md transition hover:bg-butter focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
            aria-label="Cerrar"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected(
                (selected - 1 + galleryImages.length) % galleryImages.length,
              );
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow-md transition hover:bg-butter focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
            aria-label="Foto anterior"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Image */}
          <img
            key={selected}
            src={galleryImages[selected].src}
            alt={galleryImages[selected].alt}
            className="max-h-[82vh] max-w-[86vw] md:max-w-[78vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "lbScale 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          />

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected((selected + 1) % galleryImages.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-cocoa shadow-md transition hover:bg-butter focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
            aria-label="Foto siguiente"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Counter only — no filename */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-cocoa/60 px-4 py-1.5 text-xs tabular-nums text-cream/80 backdrop-blur-sm tracking-wide">
            {selected + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function GalleryCard({
  img,
  index,
  visible,
  onClick,
}: {
  img: { src: string; alt: string };
  index: number;
  visible: boolean;
  onClick: () => void;
}) {
  const delay = Math.min(index * 35, 500);

  return (
    <button
      onClick={onClick}
      className="group relative block w-full mb-2.5 break-inside-avoid overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
      }}
      aria-label={`Ver foto ${index + 1}`}
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        className="w-full rounded-xl object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />

      {/* Vignette on hover — no text, just depth */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(58,35,20,0.25) 100%)",
        }}
      />
    </button>
  );
}