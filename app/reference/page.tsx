import Link from "next/link";
import Image from "next/image";
import { CTASection } from "@/components/CTASection";
import { IconArrow } from "@/components/icons";

export const metadata = {
  title: "Reference",
  description:
    "Vybrané realizace projekce, klimatizací, tepelných čerpadel a vzduchotechniky od Proplan Klima.",
};

const projects = [
  {
    title: "Projekt TZB — RD Olomouc",
    type: "Projekce",
    year: "2026",
    description:
      "Kompletní projektová dokumentace ve stupních DSP a DPS — tepelné čerpadlo, rekuperace i podlahové vytápění v jednom uceleném návrhu.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    title: "Rodinný dům — Olomouc",
    type: "Tepelné čerpadlo & rekuperace",
    year: "2025",
    description:
      "Nízkoenergetický dům s tepelným čerpadlem vzduch–voda a centrální rekuperací s 92% účinností.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Kanceláře — Hranice",
    type: "Multisplit klimatizace",
    year: "2025",
    description:
      "Skrytá kazetová klimatizace v podhledu s nezávislým ovládáním osmi zón.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bytový dům — Přerov",
    type: "VRV systém",
    year: "2025",
    description:
      "Centrální chlazení a vytápění pro 14 bytových jednotek s individuálním rozúčtováním.",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Showroom — Lipník nad Bečvou",
    type: "Klimatizace & VZT",
    year: "2024",
    description:
      "Designové řešení s minimalistickými mřížkami a sladěním s interiérovým konceptem.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Penzion — Beskydy",
    type: "Tepelné čerpadlo země–voda",
    year: "2024",
    description:
      "Vrtaný kolektor a integrace s FVE pro nezávislost a nejnižší provozní náklady.",
    img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Vila — Valašské Meziříčí",
    type: "Komplexní řešení",
    year: "2024",
    description:
      "Tepelné čerpadlo, klimatizace, rekuperace a chytré řízení v jednom projektu.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projekt VZT — Restaurace Přerov",
    type: "Projekce",
    year: "2023",
    description:
      "Návrh vzduchotechniky pro gastro provoz včetně odsávání, vyrovnání tlaků a hygienických norem.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Loft — Olomouc centrum",
    type: "Klimatizace",
    year: "2023",
    description:
      "Skrytá kanálová jednotka v podhledu, distribuce přes lineární výustky s designovým rámečkem.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ReferencesPage() {
  return (
    <>
      <section className="bg-paper pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="eyebrow reveal">Reference</p>
          <h1
            className="reveal font-display text-5xl sm:text-6xl text-brand-900 mt-5 max-w-3xl"
            data-delay="80"
          >
            Vybrané realizace, na které jsme <span className="italic text-brand-600">hrdí</span>.
          </h1>
          <p className="reveal mt-6 max-w-2xl text-lg text-brand-900/75" data-delay="160">
            Každý projekt je jiný — společné mají precizní provedení, čistý
            design a spokojeného klienta. Mnoho z nich začínalo u nás
            projektem na papíře.
          </p>

          <div className="reveal mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl" data-delay="220">
            {[
              { n: "9", l: "projektů na webu" },
              { n: "100+", l: "celkem realizací" },
              { n: "5+", l: "let praxe" },
              { n: "100%", l: "vlastní tým" },
            ].map((s) => (
              <div key={s.l} className="bg-white/70 backdrop-blur rounded-2xl px-4 py-4 border border-[var(--color-line)]">
                <p className="font-display text-3xl text-brand-900">{s.n}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-brand-700 mt-1 font-semibold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <article
              key={p.title}
              className={`card overflow-hidden reveal group ${p.featured ? "ring-2 ring-brand-600" : ""}`}
              data-delay={i * 60}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 text-[0.65rem] uppercase tracking-[0.2em] font-semibold bg-white/90 backdrop-blur px-3 py-1 rounded-full text-brand-800">
                  {p.year}
                </span>
                {p.featured && (
                  <span className="absolute top-4 right-4 text-[0.6rem] uppercase tracking-[0.2em] font-semibold bg-brand-900 text-white px-3 py-1 rounded-full">
                    Projekce
                  </span>
                )}
              </div>
              <div className="p-7">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-600 font-semibold">
                  {p.type}
                </p>
                <h3 className="font-display text-2xl text-brand-900 mt-2">{p.title}</h3>
                <p className="mt-3 text-brand-900/75 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/kontakt" className="btn btn-primary">
            Chci podobné řešení <IconArrow width={18} height={18} />
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
