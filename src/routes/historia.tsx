import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/maylu/Header";
import { Footer } from "@/components/maylu/Footer";
import { photos } from "@/lib/maylu-photos";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "La historia de Maylu 🐾" },
      {
        name: "description",
        content:
          "13 años de vida con Maylu. Desde que llegó cachorrito en marzo de 2013 hasta hoy.",
      },
      { property: "og:title", content: "La historia de Maylu" },
      { property: "og:description", content: "13 años de momentos con Maylu y su historia." },
      { property: "og:image", content: photos.puppyBox },
    ],
  }),
  component: Historia,
});

type Beat = {
  year: string;
  title: string;
  text: string;
  img: string;
  sensitive?: boolean;
  needs?: string;
};

const timeline: Beat[] = [
  {
    year: "10 Mar 2013",
    title: "El día que llegó Maylu",
    text: "Maylu llegó a mi vida como un cachorrito viringo peruano. Su primera foto tomada con una Nintendo 3DS. Le pusimos Maylu porque combinaba los nombres de mi hermana Lucia y el mío, Mathias. Pequeñito, asustadizo y durmiendo enroscado en una caja con una manta roja, desde ese día se volvió parte de mi vida.",
    img: photos.puppyBox,
  },
  {
    year: "2013",
    title: "Primeras caricias",
    text: "Al principio era tímido, pero Maylu pronto entendió que esta era su familia. Le encantaba que lo acariciaran y sentirse cerquita.",
    img: photos.puppyPet,
  },
  {
    year: "2013",
    title: "Dormía donde fuera",
    text: "Maylu siempre buscaba calor y compañía. Dormía donde fuera con tal de estar cerquita, como un peluche tembloroso que pedía abrazos.",
    img: photos.puppySleep,
  },
  {
    year: "2013",
    title: "Travieso y consentido",
    text: "Maylu creció rapidísimo. Le encantaba que lo vistieran y aquí está con su polera de lunares en el patio.",
    img: photos.polkaDot,
  },
  {
    year: "Dic 2013",
    title: "Su primera Navidad",
    text: "Maylu pasó su primera Navidad disfrazado de Papá Noel con los niños de la casa. Compartió navidades, cumpleaños y toda una vida con nosotros.",
    img: photos.santa,
  },
  {
    year: "2015",
    title: "Compañero de aventuras",
    text: "Ya adulto, Maylu salía conmigo a todos lados. Su collar rojo, sus orejas paradas y su forma de seguirme siempre cerca eran parte de nuestra rutina.",
    img: photos.adultStreet,
  },
  {
    year: "2017",
    title: "En casa, siempre",
    text: "Maylu fue mi guardián, mi sombra y mi compañero. 13 años a mi lado que guardo con todo el corazón.",
    img: photos.adultHome,
  },
  {
    year: "2026",
    title: "Necesita nuestra ayuda",
    text: "El dia Lunes 8 de Junio, Maylu empezó a vomitar sangre por 5 horas. Ahora está en casa conmigo, cuidándolo con pastillas antiinflamatorias y pastillas coagulantes recetadas por el veterinario. No quiero rendirme con él.",
    img: photos.vetSitting,
    sensitive: true,
    needs: "Endoscopia, exámenes prequirúrgicos y seguir con sus pastillas recetadas.",
  },
];

function TimelineItem({ beat, i }: { beat: Beat; i: number }) {
  const [show, setShow] = useState(!beat.sensitive);
  const [showPrescription, setShowPrescription] = useState(false);
  const left = i % 2 === 0;
  return (
    <div
      className={`grid gap-4 md:gap-6 md:grid-cols-2 md:items-center ${left ? "" : "md:[&>*:first-child]:order-2"}`}
    >
      <div className="relative">
        {!show && (
          <button
            onClick={() => setShow(true)}
            className="absolute inset-0 z-10 grid place-items-center rounded-2xl md:rounded-3xl bg-cocoa/80 text-center text-cream backdrop-blur-sm"
          >
            <div>
              <p className="text-2xl md:text-3xl">⚠️</p>
              <p className="mt-2 font-display font-bold">Foto sensible</p>
              <p className="text-xs opacity-80">Toca para ver</p>
            </div>
          </button>
        )}
        <img
          src={beat.img}
          alt={beat.title}
          className="aspect-[4/3] w-full rounded-2xl md:rounded-3xl object-cover shadow-xl"
        />
        {beat.sensitive && beat.needs && (
          <div className="relative md:absolute md:-bottom-5 md:right-4 z-20 max-w-full md:max-w-[16rem] mt-3 md:mt-0 rounded-2xl border-2 border-cocoa bg-butter px-4 py-3 shadow-lg">
            <p className="text-sm text-cocoa/80">{beat.needs}</p>
          </div>
        )}
        {beat.sensitive && (
          <div className="mt-3 md:mt-10">
            <button
              type="button"
              onClick={() => setShowPrescription((value) => !value)}
              className="rounded-full border-2 border-cocoa bg-butter px-4 py-2 font-display text-sm font-bold text-cocoa shadow-sm transition hover:bg-honey"
            >
              lo recetado
            </button>
            {showPrescription && (
              <img
                src={photos.vetDiag}
                alt="Lo recetado para Maylu"
                className="mt-4 w-full rounded-2xl md:rounded-3xl object-cover shadow-xl"
              />
            )}
          </div>
        )}
      </div>
      <div>
        <span className="inline-block rounded-full bg-butter px-3 py-1 font-display text-xs font-bold uppercase text-cocoa">
          {beat.year}
        </span>
        <h3 className="mt-3 font-display text-2xl md:text-3xl font-bold text-cocoa">
          {beat.title}
        </h3>
        <p className="mt-2 text-base md:text-lg text-cocoa/80">{beat.text}</p>
      </div>
    </div>
  );
}

function Historia() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-10 md:py-12 text-center">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-cocoa">
          La historia de <span className="bg-butter px-2 rounded-lg">Maylu</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-cocoa/70">
          13 años de vida con Maylu. Desde que llegó cachorrito en marzo de 2013 hasta hoy.{" "}
        </p>
      </section>

      <section className="mx-auto max-w-5xl space-y-16 px-4 pb-16">
        {timeline.map((b, i) => (
          <TimelineItem key={i} beat={b} i={i} />
        ))}
      </section>

      <Footer />
    </div>
  );
}
