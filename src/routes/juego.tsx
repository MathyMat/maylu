import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { MayluRunner } from "@/components/maylu/MayluRunner";
import MayluDefender from "@/components/maylu/MayluDefender";
import { photos } from "@/lib/maylu-photos";

export const Route = createFileRoute("/juego")({
  head: () => ({
    meta: [
      { title: "Juegos 🎮 — Maylu Run y Maylu Space Defender" },
      {
        name: "description",
        content:
          "Juega Maylu Run, un mini-juego estilo runner, o Maylu Space Defender, un shooter espacial. Dos juegos para apoyar a Maylu.",
      },
    ],
  }),
  component: Juego,
});

const games = [
  {
    id: "maylurun",
    title: "Maylu Run",
    cover: photos.maylurun,
  },
  {
    id: "mayludefender",
    title: "Maylu Space Defender",
    cover: photos.maylugame2,
  },
];

function Juego() {
  const [playing, setPlaying] = useState<string | null>(null);

  if (playing === "mayludefender") {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <section className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => setPlaying(null)}
              className="inline-flex items-center gap-1 rounded-full bg-cocoa/10 px-4 py-2 font-display text-sm font-bold text-cocoa transition hover:bg-cocoa/20"
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
              Volver a juegos
            </button>
          </div>
          <MayluDefender />
        </section>
        <Footer />
      </div>
    );
  }

  if (playing === "maylurun") {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <section className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => setPlaying(null)}
              className="inline-flex items-center gap-1 rounded-full bg-cocoa/10 px-4 py-2 font-display text-sm font-bold text-cocoa transition hover:bg-cocoa/20"
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
              Volver a juegos
            </button>
          </div>

          <h1 className="text-center font-display text-3xl md:text-5xl font-bold text-cocoa">
            Maylu Run 🐾
          </h1>

          <div className="mt-6 md:mt-8">
            <MayluRunner />
          </div>

          <div className="mt-6 md:mt-8 rounded-3xl bg-butter/60 p-4 md:p-5 text-center text-cocoa">
            <p className="font-display font-bold">Controles</p>
            <p className="mt-1 text-xs md:text-sm">
              <kbd className="rounded bg-white px-2 py-0.5 font-bold">Espacio</kbd> o{" "}
              <kbd className="rounded bg-white px-2 py-0.5 font-bold">↑</kbd> saltar ·{" "}
              <kbd className="rounded bg-white px-2 py-0.5 font-bold">↓</kbd> agacharte. En móvil:
              toca arriba para saltar, abajo para agacharte.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-8 md:py-14">
        <h1 className="text-center font-display text-3xl md:text-5xl font-bold text-cocoa">
          Juegos 🎮
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm md:text-base text-cocoa/70">
          Elige un juego y diviértete mientras ayudas a Maylu.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => setPlaying(g.id)}
              className="group overflow-hidden rounded-3xl border-2 border-cocoa/20 bg-white text-center shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={g.cover}
                  alt={g.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="font-display text-xl font-bold text-cocoa md:text-2xl">
                  {g.title}
                </h2>
              </div>
            </button>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
