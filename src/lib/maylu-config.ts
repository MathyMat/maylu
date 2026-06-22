// Configuración editable de la colecta
export interface SubMeta {
  nombre: string;
  meta: number;
}

export const CONFIG = {
  whatsapp: "51939266007",
  whatsappDisplay: "+51 939 266 007",
  yape: "+51 939 266 007",
  meta: 3000, // meta total en soles
  recaudado: 512, // monto recaudado actual
  dogName: "Maylu",
  dogBreed: "Viringo Peruano",
  dogAge: 13,
  arrivalDate: "10 de marzo de 2013",
  subMetas: [
    { nombre: "Hemograma", meta: 180 },
    { nombre: "Placas de tórax y cuello", meta: 240 },
    { nombre: "Ecografía abdominal", meta: 120 },
    { nombre: "Endoscopia", meta: 3000 - 180 - 240 - 120 }, // 2460
  ] satisfies SubMeta[],
};

export const waLink = (msg: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
