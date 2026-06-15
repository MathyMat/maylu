import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { DonationProgress } from "@/components/maylu/DonationProgress";
import { CONFIG, waLink } from "@/lib/maylu-config";
import { photos } from "@/lib/maylu-photos";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: "Cómo ayudar a Maylu — Chocotejas, Office y donaciones" },
      {
        name: "description",
        content:
          "Chocotejas Pompompurin a S/5, pack de 3 a S/14, instalación de Office a S/10. Todo para salvar a Maylu.",
      },
      { property: "og:title", content: "Cómo ayudar a Maylu" },
      {
        property: "og:description",
        content: "Chocotejas, Office y donaciones para la endoscopia de Maylu.",
      },
    ],
  }),
  component: Ayuda,
});

const choco = [
  { sabor: "Oreo", emoji: "🍪" },
  { sabor: "Pecanas", emoji: "🌰" },
  { sabor: "Manjar Blanco", emoji: "🍯" },
  { sabor: "Trufa", emoji: "🍫" },
];

function Ayuda() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-center font-display text-4xl font-bold text-cocoa sm:text-5xl">
          Cómo ayudar 💛
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-cocoa/70 sm:text-lg">
          Soy estudiante de Desarrollo de Software y por mis horarios no puedo conseguir un trabajo.
          Para reunir lo de la operación de Maylu estoy vendiendo chocotejas e instalando Office.
          Toda ayuda suma.
        </p>

        <div className="mt-8">
          <DonationProgress />
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-8 md:grid-cols-2 md:gap-6">
        <article className="rounded-3xl border-2 border-butter bg-white p-5 shadow-[0_10px_0_-2px_var(--color-honey)] sm:p-7">
          <img
            src={photos.chocotejas}
            alt="Chocotejas de Maylu"
            className="mb-5 aspect-[16/9] w-full rounded-3xl object-cover shadow-md"
          />
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-butter text-3xl">
              🍫
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-cocoa">Chocotejas Pompompurin</h2>
              <p className="text-sm text-cocoa/60">Hechas en casa con amor</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="font-display text-3xl font-bold text-cocoa sm:text-4xl">S/ 5</p>
            <p className="text-cocoa/60">c/u</p>
            <span className="ml-auto rounded-full bg-blush/60 px-3 py-1 text-sm font-bold text-cocoa">
              Pack de 3 → S/ 14
            </span>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-2">
            {choco.map((c) => (
              <li
                key={c.sabor}
                className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2 text-sm font-semibold text-cocoa"
              >
                <span className="text-xl">{c.emoji}</span> {c.sabor}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm font-bold text-cocoa">🚚 Envío gratis</p>

          <a
            href={waLink("Hola! Quiero pedir chocotejas Pompompurin para apoyar a Maylu 🐾")}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-full bg-cocoa py-3 text-center font-display font-bold text-cream shadow-lg transition hover:scale-[1.02]"
          >
            Pedir por WhatsApp
          </a>
        </article>

        <article className="rounded-3xl border-2 border-blush bg-white p-5 shadow-[0_10px_0_-2px_var(--color-blush)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blush text-3xl">
              💻
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-cocoa">Instalación de Office</h2>
              <p className="text-sm text-cocoa/60">Permanente · Soy dev en formación</p>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-4">
            <p className="font-display text-3xl font-bold text-cocoa sm:text-4xl">S/ 10</p>
            <p className="text-cocoa/60">por instalación</p>
          </div>

          <p className="mt-5 text-cocoa/80">
            Te dejo Office instalado de manera permanente en tu computadora. Rápido, limpio y con
            soporte si algo falla.
          </p>

          <a
            href={waLink(
              "Hola! Me interesa la instalación de Office a S/10 para apoyar a Maylu 🐾",
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-full bg-cocoa py-3 text-center font-display font-bold text-cream shadow-lg transition hover:scale-[1.02]"
          >
            Solicitar por WhatsApp
          </a>
        </article>

        <article className="rounded-3xl border-2 border-cocoa bg-butter p-5 md:col-span-2 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-cocoa sm:text-2xl">
                Donación directa por Yape / Plin 💛
              </h2>
              <p className="mt-1 text-sm text-cocoa/80 sm:text-base">
                Si quieres apoyar a salvar a mi niño, escríbeme por WhatsApp al{" "}
                {CONFIG.whatsappDisplay}.
              </p>
            </div>
            <a
              href={waLink(`Hola! Quiero donar para Maylu 💛 ¿Me pasas tu Yape al ${CONFIG.yape}?`)}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-full bg-cocoa px-6 py-3 text-center font-display font-bold text-cream shadow-lg sm:w-auto"
            >
              Pedir Yape
            </a>
          </div>
        </article>

        <article className="rounded-3xl border-2 border-honey bg-white p-5 md:col-span-2 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-cocoa sm:text-2xl">
                GoFundMe — Donación internacional ❤️
              </h2>
              <p className="mt-1 text-sm text-cocoa/80 sm:text-base">
                Si quieres ayudar desde el extranjero, tengo una campaña en GoFundMe.
              </p>
            </div>
            <a
              href="https://www.gofundme.com/f/help-maylu-get-the-surgery-he-urgently-needs"
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-full bg-honey px-6 py-3 text-center font-display font-bold text-cocoa shadow-lg transition hover:scale-105 sm:w-auto"
            >
              Ir a GoFundMe
            </a>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <p className="font-display text-xl font-bold text-cocoa sm:text-2xl">
          Muchas gracias por tomarte el tiempo de leer 💛
        </p>
        <p className="mt-2 text-cocoa/70">Ayúdame a salvar a {CONFIG.dogName}.</p>
      </section>

      <Footer />
    </div>
  );
}
