// Configuración editable de la colecta
export const CONFIG = {
  whatsapp: "51939266007",
  whatsappDisplay: "+51 939 266 007",
  yape: "+51 939 266 007",
  meta: 3000, // meta en soles
  recaudado: 143, // monto recaudado actual
  dogName: "Maylu",
  dogBreed: "Viringo Peruano",
  dogAge: 13,
  arrivalDate: "10 de marzo de 2013",
};

export const waLink = (msg: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
