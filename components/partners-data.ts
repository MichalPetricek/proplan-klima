// Partneři / dodavatelé, se kterými firma spolupracuje.
// Loga (oficiální, stažená z webů výrobců / Wikimedia) jsou v /public/partners.
// Lze je kdykoli nahradit jinou verzí beze změny kódu, jen přepsáním souboru.
export type Partner = { name: string; logo: string; note?: string };

export const partners: Partner[] = [
  { name: "Atrea", logo: "/partners/atrea.svg" },
  { name: "Remak", logo: "/partners/remak.png" },
  { name: "Mandík", logo: "/partners/mandik.png" },
  { name: "Midea", logo: "/partners/midea.svg" },
  { name: "Buderus", logo: "/partners/buderus.svg" },
  { name: "Bosch", logo: "/partners/bosch.png" },
  { name: "Giacomini", logo: "/partners/giacomini.svg" },
  { name: "Viega", logo: "/partners/viega.svg" },
  { name: "Reflex", logo: "/partners/reflex.svg" },
  { name: "ETA", logo: "/partners/eta.jpg", note: "ETA Energy - výrobce kotlů" },
];
