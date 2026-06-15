import { photos } from "@/lib/maylu-photos";

export type StoryBeat = {
  score: number;
  img: string;
  title: string;
  text: string;
  final?: boolean;
};

export const beats: StoryBeat[] = [
  {
    score: 0,
    img: photos.puppyBox,
    title: "10 de marzo de 2013",
    text: "Un cachorrito viringo llegó a mi casa. Durmió toda la primera noche enroscado en una manta roja. Le pusimos Maylu.",
  },
  {
    score: 100,
    img: photos.puppyPet,
    title: "Las primeras caricias",
    text: "Era pequeñito y asustadizo, pero pronto entendió que aquí era su hogar.",
  },
  {
    score: 250,
    img: photos.puppySleep,
    title: "Siempre cerquita",
    text: "Dormía donde fuera, con tal de estar pegado a alguien.",
  },
  {
    score: 400,
    img: photos.polkaDot,
    title: "Travieso y consentido",
    text: "Creció rapidísimo. Le encantaba que lo vistiéramos.",
  },
  {
    score: 600,
    img: photos.santa,
    title: "Navidades en familia",
    text: "Pasó navidades, cumpleaños, una vida entera con nosotros.",
  },
  {
    score: 800,
    img: photos.adultStreet,
    title: "Mi compañero de aventuras",
    text: "Ya adulto, salíamos juntos a todos lados. Su collar rojo, sus orejas paradas.",
  },
  {
    score: 1000,
    img: photos.adultHome,
    title: "13 años a mi lado",
    text: "Mi viringo, mi sombra, mi niño.",
  },
  {
    score: 1200,
    img: photos.vetSitting,
    title: "Hoy te necesitamos",
    text: "Hace 2 días Maylu empezó a vomitar sangre. Necesita una endoscopia y exámenes para operarse. No quiero rendirme. Ayúdame a salvarlo.",
    final: true,
  },
];
