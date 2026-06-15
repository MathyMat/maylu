import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { MayluRunner } from "@/components/maylu/MayluRunner";

export const Route = createFileRoute("/juego")({
  head: () => ({
    meta: [
      { title: "Maylu Run 🎮 — La historia de Maylu en mini-juego" },
      {
        name: "description",
        content:
          "Juega Maylu Run, un mini-juego estilo dinosaurio de Chrome que cuenta la historia de mi viringo Maylu.",
      },
      { property: "og:title", content: "Maylu Run 🎮" },
      { property: "og:description", content: "Juega y conoce la historia de Maylu." },
    ],
  }),
  component: Juego,
});

function Juego() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-center font-display text-5xl font-bold text-cocoa">
          Maylu Run 🎮
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-cocoa/70">
          Salta, haz doble salto, agáchate y recoge huesitos 🦴 para sumar
          puntos. Cada vez que pierdas te contamos una curiosidad sobre los
          viringos peruanos.
        </p>

        <div className="mt-8">
          <MayluRunner />
        </div>

        <div className="mt-8 rounded-3xl bg-butter/60 p-5 text-center text-cocoa">
          <p className="font-display font-bold">Controles</p>
          <p className="mt-1 text-sm">
            <kbd className="rounded bg-white px-2 py-0.5 font-bold">Espacio</kbd>{" "}
            o <kbd className="rounded bg-white px-2 py-0.5 font-bold">↑</kbd>{" "}
            saltar (doble salto disponible) ·{" "}
            <kbd className="rounded bg-white px-2 py-0.5 font-bold">↓</kbd>{" "}
            agacharte para esquivar pájaros. En móvil: toca arriba para saltar y
            abajo para agacharte.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
