import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { DonationProgress } from "@/components/maylu/DonationProgress";
import { Comments } from "@/components/maylu/Comments";
import { photos } from "@/lib/maylu-photos";
import { CONFIG } from "@/lib/maylu-config";

const DONORS = [
  { name: "Sergio Cam*",  time: "Hoy 12:56 am",  message: "", amount: "S/ 15.00" },
  { name: "Pablo Mor*",   time: "Hoy 12:37 am",  message: "", amount: "S/ 15.00" },
  { name: "Artemon Osp*", time: "Ayer 11:51 pm", message: "", amount: "S/ 2.00"  },
  { name: "Alia Osp*",    time: "Ayer 11:41 pm", message: "", amount: "S/ 2.00"  },
  { name: "Fabiola Mon*", time: "Ayer 8:19 pm",  message: "", amount: "S/ 3.40"  },
  { name: "Viviana Ven*", time: "Hoy 2:10 pm",   message: "", amount: "S/ 5.00"  },
  { name: "Viviana Ven*", time: "Hoy 12:31 pm",  message: "", amount: "S/ 5.00"  },
  { name: "Raul Jan*",    time: "Hoy 11:31 am",  message: "", amount: "S/ 15.00" },
  { name: "Wilser Ant*",  time: "Hoy 2:04 am",   message: "", amount: "S/ 10.00" },
  { name: "Yamilet Gar*", time: "Hoy 1:09 am",   message: "", amount: "S/ 0.90"  },
  { name: "Carmen Agu*",  time: "Hoy 1:09 am",   message: "", amount: "S/ 5.00"  },
];

const INITIAL_VISIBLE = 5;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayuda a Maylu — Colecta urgente" },
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

function DonorList({ id }: { id?: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? DONORS : DONORS.slice(0, INITIAL_VISIBLE);

  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="rounded-3xl border-2 border-blush bg-white/80 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-cocoa sm:text-2xl">
            Gracias a quienes apoyaron
          </h2>
          <span className="rounded-full bg-butter px-3 py-1 text-xs font-semibold text-cocoa">
            {DONORS.length} personas
          </span>
        </div>

        <ul className="divide-y divide-cocoa/8">
          {visible.map((d, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-4 py-3"
              style={{
                opacity: expanded || i < INITIAL_VISIBLE ? 1 : 0,
                transition: `opacity 0.3s ease ${(i - INITIAL_VISIBLE) * 60}ms`,
              }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-butter text-sm font-bold text-cocoa">
                  {d.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className="block font-semibold text-cocoa text-sm leading-snug">{d.name}</span>
                  {d.message && (
                    <span className="mt-0.5 block text-xs text-cocoa/60 italic leading-snug truncate max-w-[220px] sm:max-w-sm">
                      "{d.message}"
                    </span>
                  )}
                  {d.time && (
                    <span className="mt-0.5 block text-[11px] text-cocoa/40">{d.time}</span>
                  )}
                </div>
              </div>

              {d.amount && (
                <span className="shrink-0 rounded-full bg-honey/30 px-3 py-1 text-sm font-bold text-cocoa tabular-nums">
                  {d.amount}
                </span>
              )}
            </li>
          ))}
        </ul>

        {DONORS.length > INITIAL_VISIBLE && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-cocoa/20 py-2.5 text-sm font-semibold text-cocoa/70 transition hover:border-cocoa/40 hover:text-cocoa"
          >
            {expanded ? (
              <>
                Ver menos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </>
            ) : (
              <>
                Ver los {DONORS.length - INITIAL_VISIBLE} donadores más
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-butter)_0%,transparent_55%),radial-gradient(circle_at_bottom_left,var(--color-blush)_0%,transparent_50%)] opacity-60" />
        <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 px-4 py-8 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-cocoa sm:text-4xl md:text-6xl">
              Ayúdame a salvar a{" "}
              <span className="bg-butter px-2 -rotate-1 inline-block rounded-lg">
                {CONFIG.dogName}
              </span>
            </h1>
            <p className="mt-3 md:mt-4 max-w-lg text-sm text-cocoa/80 sm:text-base md:text-lg">
              {CONFIG.dogBreed} · {CONFIG.dogAge} años · Mi compañero desde el {CONFIG.arrivalDate}.
              Hace 2 días empezó a vomitar sangre y necesita una endoscopia urgente.
            </p>
            <div className="mt-4 md:mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/ayuda"
                className="inline-flex w-full justify-center rounded-full bg-cocoa px-5 md:px-6 py-3 font-display font-bold text-sm md:text-base text-cream shadow-lg transition hover:scale-105 sm:w-auto"
              >
                Cómo ayudar
              </Link>
              <Link
                to="/historia"
                className="inline-flex w-full justify-center rounded-full border-2 border-cocoa bg-cream px-5 md:px-6 py-3 font-display font-bold text-sm md:text-base text-cocoa transition hover:bg-butter sm:w-auto"
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
              className="mx-auto w-full max-w-md rounded-[2.5rem] object-cover shadow-2xl"
              style={{ aspectRatio: "4/5" }}
            />
            <div className="absolute -bottom-4 -left-4 rotate-[-6deg] rounded-2xl bg-white px-4 py-2 shadow-lg">
              <span className="block font-display text-sm font-bold text-cocoa">Maylu</span>
              <span className="block text-xs text-cocoa/60">desde 2013</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <DonationProgress />
          <div className="rounded-3xl border-2 border-blush bg-white/80 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-cocoa sm:text-2xl">
              ¿Qué le pasa a Maylu?
            </h2>
            <p className="mt-3 text-sm text-cocoa/80 sm:text-base">
              Estuvo vomitando sangre sin parar por <strong>5 horas seguidas</strong>. Los
              veterinarios me dijeron que necesita una <strong>endoscopia</strong> y{" "}
              <strong>exámenes prequirúrgicos</strong> para evaluar el riesgo de la operación, ya
              que tiene 13 años. Me dieron la opción de dormirlo, pero quiero luchar por él.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="rounded-[2rem] border-2 border-cocoa bg-white/80 p-4 shadow-[0_10px_0_-2px_var(--color-honey)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="block font-display text-xs font-bold uppercase tracking-wider text-honey sm:text-sm">
                Lo que ofrezco
              </span>
              <h2 className="mt-2 font-display text-xl font-bold text-cocoa sm:text-2xl md:text-4xl">
                Apóyame con chocotejas o con instalación de Office
              </h2>
              <p className="mt-2 md:mt-3 text-sm text-cocoa/80 sm:text-base">
                Cada compra ayuda a Maylu. Si quieres ver precios, pedidos y formas de apoyar, entra
                a la sección de ayuda.
              </p>
            </div>
            <Link
              to="/ayuda"
              className="inline-flex w-full justify-center rounded-full bg-cocoa px-5 md:px-6 py-3 font-display font-bold text-sm md:text-base text-cream shadow-lg transition hover:scale-105 md:w-auto"
            >
              Ir a Ayudar
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="overflow-hidden rounded-3xl bg-butter/70 p-4 sm:p-5">
              <img
                src={photos.chocotejas}
                alt="Chocotejas Pompompurin"
                className="mb-4 aspect-[16/10] w-full rounded-2xl object-cover"
              />
              <span className="block font-display text-lg font-bold text-cocoa sm:text-xl">
                Chocotejas Pompompurin
              </span>
              <span className="mt-2 block text-sm text-cocoa/80">
                Hechas en casa, con sabores que puedes elegir y entrega gratis.
              </span>
            </div>
            <div className="rounded-3xl bg-blush/40 p-4 sm:p-5">
              <img
                src="https://www.euskomilenio.com/wp-content/uploads/2022/08/OFFICE-365.png"
                alt="Instalación de Office"
                className="mb-4 aspect-[16/10] w-full rounded-2xl bg-white object-cover"
              />
              <span className="block font-display text-lg font-bold text-cocoa sm:text-xl">
                Instalación de Office
              </span>
              <span className="mt-2 block text-sm text-cocoa/80">
                Soporte permanente para dejar todo listo en tu computadora.
              </span>
            </div>
            <div className="rounded-3xl bg-honey/30 p-4 sm:p-5">
              {/* ✅ div en lugar de p para evitar hydration error con emoji */}
              <div className="mb-4 flex aspect-[16/10] items-center justify-center rounded-2xl bg-white/60">
                <span className="text-6xl" role="img" aria-label="corazón">❤️</span>
              </div>
              <span className="block font-display text-lg font-bold text-cocoa sm:text-xl">GoFundMe</span>
              <span className="mt-2 block text-sm text-cocoa/80">
                Donación internacional para la cirugía urgente de Maylu.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="rounded-3xl border-2 border-cocoa bg-butter/80 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-cocoa sm:text-2xl">
                Donación directa por Yape / Plin
              </h2>
              <p className="mt-1 text-sm text-cocoa/80 sm:text-base">
                También puedes donar directo al número de abajo.
              </p>
            </div>
            <span className="font-display text-3xl font-bold tracking-wider text-cocoa sm:text-4xl">
              939 266 007
            </span>
          </div>
        </div>
      </section>

      <DonorList id="donadores" />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display text-2xl font-bold text-cocoa sm:text-3xl">
          13 años de momentos juntos
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[photos.puppyBox, photos.santa, photos.polkaDot, photos.adultHome].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Maylu foto ${i + 1}`}
              className="aspect-square w-full rounded-2xl object-cover shadow-md transition hover:-rotate-2 hover:scale-105"
            />
          ))}
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

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-butter p-6 text-center shadow-[0_10px_0_-2px_var(--color-honey)] sm:p-8">
          <h2 className="font-display text-2xl font-bold text-cocoa sm:text-3xl">
            Catálogo de juegos
          </h2>
          <p className="mt-2 text-sm text-cocoa/80 sm:text-base">
            El protagonista es Maylu.
          </p>
          <Link
            to="/juego"
            className="mt-5 inline-flex w-full justify-center rounded-full bg-cocoa px-6 py-3 font-display font-bold text-cream shadow-lg transition hover:scale-105 sm:w-auto"
          >
            Ver catálogo →
          </Link>
        </div>
      </section>

      <Comments />

      <Footer />
    </div>
  );
}