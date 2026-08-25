import Image from "next/image";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { IconArrow, IconCheck } from "@/components/icons";
import { asset } from "@/lib/paths";
import { ReferenceGallery } from "@/components/ReferenceContent";

export const metadata = {
  title: "Reference",
  description:
    "Ukázky realizovaných kotelen, průmyslové vzduchotechniky a projektové dokumentace TZB od Proplan Klima.",
};

const documents = [
  {
    title: "Projekt vzduchotechniky",
    text: "Koordinovaný návrh tras, dimenzí a koncových prvků jako pevný základ bezproblémové realizace.",
    image: "/projects/vzt-project.jpg",
    alt: "Rozvinutá projektová dokumentace vzduchotechniky",
  },
  {
    title: "Schéma zdroje tepla",
    text: "Detailní technologické schéma, které propojuje zdroj, akumulaci, vytápění i přípravu teplé vody.",
    image: "/projects/heat-source-schema.jpg",
    alt: "Technologické schéma zdroje tepla",
  },
] as const;

export default function ReferencesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper pt-14 lg:pt-20 pb-20 lg:pb-28">
        <div aria-hidden className="blob bg-brand-300/35 w-[420px] h-[420px] -top-48 -right-16" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="eyebrow reveal">Reference</p>
            <h1 className="reveal font-display text-5xl sm:text-6xl lg:text-7xl text-brand-900 mt-5 leading-[1.02]" data-delay="80">
              Projekty, které fungují <span className="italic text-brand-600">i mimo papír</span>.
            </h1>
            <p className="reveal mt-6 max-w-xl text-lg text-brand-900/75 leading-relaxed" data-delay="150">
              Podívejte se na ukázky naší projekční práce a dokončených
              technologií. Od detailního schématu až po spuštěnou kotelnu nebo
              vzduchotechnickou jednotku.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-3" data-delay="220">
              <Link href="/kontakt" className="btn btn-primary">
                Probrat Váš projekt <IconArrow width={18} height={18} />
              </Link>
              <a href="#realizace" className="btn btn-ghost">Prohlédnout realizace</a>
            </div>
          </div>

          <div className="relative reveal" data-delay="180">
            <div className="relative aspect-[6/5] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-32px_rgba(59,42,31,0.42)]">
              <Image
                src={asset("/projects/industrial-air-handling.jpg")}
                alt="Realizovaná venkovní vzduchotechnická jednotka"
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/55 via-transparent to-transparent" />
              <div className="absolute left-6 bottom-6 text-white">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/70 font-semibold">Projekce · dodávka · dozor</p>
                <p className="font-display text-3xl mt-1">Technika dotažená do detailu</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-4 sm:-left-7 rounded-2xl bg-white border border-[var(--color-line)] shadow-xl px-5 py-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-brand-600 font-semibold">Jeden partner</p>
              <p className="font-display text-2xl text-brand-900 mt-1">Od návrhu po provoz</p>
            </div>
          </div>
        </div>
      </section>

      <section id="realizace" className="py-24 lg:py-32 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-end mb-14">
            <div>
              <p className="eyebrow reveal">Hotová řešení</p>
              <h2 className="font-display text-4xl sm:text-5xl text-brand-900 mt-5 reveal" data-delay="80">
                Vybrané <span className="italic text-brand-600">realizace</span>
              </h2>
            </div>
            <p className="text-brand-900/70 leading-relaxed lg:max-w-xl lg:justify-self-end reveal" data-delay="140">
              Každá technologie vychází z konkrétního prostoru a provozních
              požadavků. Proto řešíme stejně pečlivě výkon, vedení rozvodů,
              přístup pro servis i výsledný vzhled.
            </p>
          </div>

          <ReferenceGallery />
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-paper-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <p className="eyebrow reveal">Projekce</p>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-900 mt-5 reveal" data-delay="80">
              Kvalitní realizace začíná <span className="italic text-brand-600">přesným návrhem</span>.
            </h2>
            <p className="mt-5 text-brand-900/72 leading-relaxed reveal" data-delay="140">
              Připravujeme srozumitelnou projektovou dokumentaci pro stavbu,
              koordinaci profesí i následný servis technologie.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {documents.map((document, i) => (
              <article key={document.title} className="card overflow-hidden reveal" data-delay={i * 100}>
                <div className="relative aspect-[16/10] bg-white overflow-hidden">
                  <Image
                    src={asset(document.image)}
                    alt={document.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={document.image.includes("schema") ? "object-contain p-4" : "object-cover"}
                  />
                </div>
                <div className="p-7 sm:p-8">
                  <h3 className="font-display text-3xl text-brand-900">{document.title}</h3>
                  <p className="mt-3 text-brand-900/72 leading-relaxed">{document.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="eyebrow reveal">Klimatizace</p>
            <h2 className="font-display text-4xl sm:text-5xl text-brand-900 mt-5 reveal" data-delay="80">
              Technika, která zapadne do <span className="italic text-brand-600">Vašeho prostoru</span>.
            </h2>
            <p className="mt-5 text-brand-900/75 leading-relaxed reveal" data-delay="140">
              Pomůžeme vybrat výkon, provedení i umístění jednotky. Nabízíme
              úsporné klimatizace v klasickém světlém i výrazném tmavém designu.
            </p>
            <ul className="mt-7 space-y-3 reveal" data-delay="190">
              {["Návrh správného výkonu", "Citlivé umístění v interiéru", "Dodávka, montáž a servis"].map((item) => (
                <li key={item} className="flex gap-3 items-center text-brand-900/85">
                  <IconCheck width={20} height={20} className="text-brand-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/sluzby#klimatizace" className="btn btn-primary mt-8 reveal" data-delay="240">
              Klimatizace na míru <IconArrow width={18} height={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 reveal" data-delay="160">
            <div className="relative aspect-square rounded-[1.75rem] overflow-hidden bg-[#e9f5ff] border border-[var(--color-line)]">
              <Image src={asset("/projects/ac-midea.jpg")} alt="Světlá klimatizace Midea s venkovní jednotkou" fill unoptimized sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-[1.75rem] overflow-hidden bg-white border border-[var(--color-line)] mt-8">
              <Image src={asset("/projects/ac-solstice.jpg")} alt="Tmavá klimatizace Midea s venkovní jednotkou" fill unoptimized sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
