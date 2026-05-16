import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { IconArrow, IconCheck } from "@/components/icons";

export const metadata = {
  title: "O nás",
  description:
    "Proplan Klima — projekce TZB, klimatizací, vzduchotechniky a tepelných čerpadel. Rychlost, přesnost a flexibilita řešení.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-paper pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
          <div>
            <p className="eyebrow reveal">O nás</p>
            <h1 className="reveal font-display text-5xl sm:text-6xl lg:text-7xl text-brand-900 mt-5 leading-[1.05]" data-delay="80">
              Projektanti TZB s&nbsp;<span className="italic text-brand-600">rukama na stavbě</span>.
            </h1>
            <p className="reveal mt-6 text-lg text-brand-900/80 leading-relaxed" data-delay="160">
              Proplan Klima vzniklo proto, aby projekce klimatizací,
              vzduchotechniky a tepelných čerpadel přestala být na stavbě
              kompromisem. Naší hlavní činností je projekce TZB — a protože
              víme, jak má vypadat dobrá dokumentace, umíme ji i postavit.
            </p>
            <p className="reveal mt-5 text-brand-900/75 leading-relaxed" data-delay="200">
              Kombinujeme pokročilý počítačový design, ověřené značky
              a zkušenost z desítek dokončených staveb. Pracujeme s investory,
              architekty i s majiteli rodinných domů.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="260">
              <Link href="/sluzby#projekce" className="btn btn-primary">
                Naše hlavní činnost <IconArrow width={18} height={18} />
              </Link>
              <Link href="/kontakt" className="btn btn-ghost">
                Spojit se
              </Link>
            </div>
          </div>
          <div className="reveal" data-delay="200">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-32px_rgba(59,42,31,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                alt="Tým Proplan Klima"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 flex items-center gap-4">
                <Image src="/logo.png" alt="Proplan Klima" width={1500} height={1000} className="h-10 w-auto" />
                <p className="text-sm text-brand-900/80">
                  Projekce a&nbsp;realizace pro&nbsp;Vaši&nbsp;nemovitost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-paper-soft">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { n: "5+", l: "let zkušeností" },
              { n: "100+", l: "projektů a realizací" },
              { n: "100%", l: "vlastní tým" },
              { n: "48 h", l: "reakce na servis" },
            ].map((s) => (
              <div key={s.l} className="reveal bg-white rounded-2xl border border-[var(--color-line)] py-8 px-4">
                <p className="font-display text-5xl text-brand-900">{s.n}</p>
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brand-700 mt-2 font-semibold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-14">
          <div>
            <p className="eyebrow reveal">Filozofie</p>
            <h2 className="font-display text-4xl text-brand-900 mt-5 reveal" data-delay="80">
              Dobrý projekt ušetří víc než dobrá sleva.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-brand-900/80 leading-relaxed reveal">
              Věříme, že technologie pro vytápění, chlazení a větrání by měla
              být tichou součástí architektury — ne rušivým prvkem. Proto
              klademe důraz na pečlivý návrh, čisté provedení a integraci do
              interiéru. Stejnou pozornost věnujeme energetické ekonomice
              celého řešení.
            </p>
            <ul className="space-y-2.5">
              {[
                "Projekce je řemeslo — nepodceňujeme ji ani u malých staveb.",
                "Vždy spočítáme tepelné ztráty a zisky. Bez čísel ne.",
                "Návrh děláme tak, aby šel postavit, ne jen vypadat na papíře.",
                "Cenu řešení známe od začátku, ne až při dokončování.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-brand-900/85 reveal">
                  <IconCheck width={20} height={20} className="text-brand-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-paper">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <p className="eyebrow reveal">Partneři a značky</p>
          <h2 className="font-display text-4xl text-brand-900 mt-5 reveal" data-delay="80">
            S kým spolupracujeme
          </h2>
          <p className="mt-5 text-brand-900/80 leading-relaxed max-w-3xl reveal" data-delay="120">
            Pracujeme s renomovanými výrobci klimatizační a topenářské
            techniky. Spolupracujeme s architektonickými studii, developery
            i přímo s majiteli rodinných domů.
          </p>
          <div className="mt-10 grid grid-cols-3 sm:grid-cols-5 gap-3 reveal" data-delay="160">
            {["DAIKIN", "MITSUBISHI", "PANASONIC", "LG", "SAMSUNG", "TOSHIBA", "VAILLANT", "REGULUS", "GREE", "AC HEATING"].map((b) => (
              <div
                key={b}
                className="bg-white border border-[var(--color-line)] rounded-xl px-3 py-4 text-center text-brand-800 font-display tracking-[0.2em] text-sm"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
