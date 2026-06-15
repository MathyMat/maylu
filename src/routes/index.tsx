import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { DonationProgress } from "@/components/maylu/DonationProgress";
import { photos } from "@/lib/maylu-photos";
import { CONFIG } from "@/lib/maylu-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayuda a Maylu 🐾 — Colecta urgente" },
      {
        name: "description",
        content:
          "Maylu, mi viringo peruano de 13 años, necesita una endoscopia urgente. Apóyame comprando chocotejas Pompompurin o donando.",
      },
      { property: "og:title", content: "Ayuda a salvar a Maylu" },
      {
        property: "og:description",
        content: "Colecta urgente para la endoscopia de mi viringo de 13 años.",
      },
      { property: "og:image", content: photos.portrait },
      { name: "twitter:image", content: photos.portrait },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-butter)_0%,transparent_55%),radial-gradient(circle_at_bottom_left,var(--color-blush)_0%,transparent_50%)] opacity-60" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-cocoa md:text-6xl">
              Ayúdame a salvar a{" "}
              <span className="bg-butter px-2 -rotate-1 inline-block rounded-lg">
                {CONFIG.dogName}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-cocoa/80">
              {CONFIG.dogBreed} · {CONFIG.dogAge} años · Mi compañero desde el{" "}
              {CONFIG.arrivalDate}. Hace 2 días empezó a vomitar sangre y necesita
              una endoscopia urgente.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/ayuda"
                className="rounded-full bg-cocoa px-6 py-3 font-display font-bold text-cream shadow-lg transition hover:scale-105"
              >
                💛 Cómo ayudar
              </Link>
              <Link
                to="/historia"
                className="rounded-full border-2 border-cocoa bg-cream px-6 py-3 font-display font-bold text-cocoa transition hover:bg-butter"
              >
                Su historia →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-butter rotate-3" />
            <img
              src={photos.portrait}
              alt="Retrato de Maylu, viringo peruano negro"
              className="w-full rounded-[2.5rem] object-cover shadow-2xl"
              style={{ aspectRatio: "4/5" }}
            />
            <div className="absolute -bottom-4 -left-4 rotate-[-6deg] rounded-2xl bg-white px-4 py-2 shadow-lg">
              <p className="font-display text-sm font-bold text-cocoa">
                Maylu 🐾
              </p>
              <p className="text-xs text-cocoa/60">desde 2013</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress + Urgencia */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <DonationProgress />
          <div className="rounded-3xl border-2 border-blush bg-white/80 p-6">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              ¿Qué le pasa a Maylu?
            </h2>
            <p className="mt-3 text-cocoa/80">
              Estuvo vomitando sangre sin parar por <strong>5 horas seguidas</strong>.
              Los veterinarios me dijeron que necesita una{" "}
              <strong>endoscopia</strong> y <strong>exámenes prequirúrgicos</strong>{" "}
              para evaluar el riesgo de la operación, ya que tiene 13 años. Me dieron
              la opción de dormirlo, pero quiero luchar por él.
            </p>
          </div>
        </div>
      </section>

      {/* Preview de ayuda */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-[2rem] border-2 border-cocoa bg-white/80 p-6 shadow-[0_10px_0_-2px_var(--color-honey)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="font-display text-sm font-bold uppercase tracking-wider text-honey">
                Lo que ofrezco
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-cocoa md:text-4xl">
                Apóyame con chocotejas o con instalación de Office
              </h2>
              <p className="mt-3 text-cocoa/80">
                Cada compra ayuda a Maylu. Si quieres ver precios, pedidos y formas de apoyar,
                entra a la sección de ayuda.
              </p>
            </div>
            <Link
              to="/ayuda"
              className="inline-flex rounded-full bg-cocoa px-6 py-3 font-display font-bold text-cream shadow-lg transition hover:scale-105"
            >
              Ir a Ayudar
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-3xl bg-butter/70 p-5">
              <img
                src={photos.chocotejas}
                alt="Chocotejas Pompompurin"
                className="mb-4 aspect-[16/10] w-full rounded-2xl object-cover"
              />
              <p className="font-display text-xl font-bold text-cocoa">Chocotejas Pompompurin</p>
              <p className="mt-2 text-sm text-cocoa/80">
                Hechas en casa, con sabores que puedes elegir y entrega gratis.
              </p>
            </div>
            <div className="rounded-3xl bg-blush/40 p-5">
              <img
                src="https://www.euskomilenio.com/wp-content/uploads/2022/08/OFFICE-365.png"
                alt="Instalación de Office"
                className="mb-4 aspect-[16/10] w-full rounded-2xl bg-white object-cover"
              />
              <p className="font-display text-xl font-bold text-cocoa">Instalación de Office</p>
              <p className="mt-2 text-sm text-cocoa/80">
                Soporte permanente para dejar todo listo en tu computadora.
              </p>
            </div>
            <div className="rounded-3xl bg-honey/30 p-5">
              <div className="mb-4 flex aspect-[16/10] items-center justify-center rounded-2xl bg-white/60">
                <p className="text-6xl">❤️</p>
              </div>
              <p className="font-display text-xl font-bold text-cocoa">GoFundMe</p>
              <p className="mt-2 text-sm text-cocoa/80">
                Donación internacional para la cirugía urgente de Maylu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story strip */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display text-3xl font-bold text-cocoa">
          13 años de momentos juntos
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[photos.puppyBox, photos.santa, photos.polkaDot, photos.adultHome].map(
            (src, i) => (
              <img
                key={i}
                src={src}
                alt={`Maylu foto ${i + 1}`}
                className="aspect-square w-full rounded-2xl object-cover shadow-md transition hover:-rotate-2 hover:scale-105"
              />
            ),
          )}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/historia"
            className="font-display font-bold text-cocoa underline decoration-butter decoration-4 underline-offset-4 hover:text-honey"
          >
            Ver toda su historia →
          </Link>
        </div>
      </section>

      {/* CTA juego */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-butter p-8 text-center shadow-[0_10px_0_-2px_var(--color-honey)]">
          <p className="text-5xl">🎮</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-cocoa">
            Juega y conoce la historia de Maylu
          </h2>
          <p className="mt-2 text-cocoa/80">
            Un mini-juego estilo dinosaurio que te cuenta su vida, foto por foto.
          </p>
          <Link
            to="/juego"
            className="mt-5 inline-flex rounded-full bg-cocoa px-6 py-3 font-display font-bold text-cream shadow-lg transition hover:scale-105"
          >
            Jugar Maylu Run
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
