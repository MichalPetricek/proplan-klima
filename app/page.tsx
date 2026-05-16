import Link from "next/link";
import Image from "next/image";
import { services } from "@/components/services-data";
import { CTASection } from "@/components/CTASection";
import { IconArrow, IconCheck } from "@/components/icons";

const HERO =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
const GALLERY = [
  { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80", label: "Projekt TZB pro novostavbu RD", type: "Projekce" },
  { src: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=900&q=80", label: "Klimatizace v obývacím pokoji", type: "Klimatizace" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", label: "Strojovna tepelného čerpadla", type: "Tepelné čerpadlo" },
  { src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80", label: "Rozvody VZT v podhledu", type: "Vzduchotechnika" },
  { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80", label: "Designová instalace v ložnici", type: "Klimatizace" },
  { src: "https://images.unsplash.com/photo-1597490280022-c9f76a9c8b18?auto=format&fit=crop&w=900&q=80", label: "Venkovní jednotka u RD", type: "Tepelné čerpadlo" },
  { src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80", label: "Kazetová jednotka v kanceláři", type: "Klimatizace" },
];

const PROCESS_IMG =
  "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80";

export default function Home() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-paper">
        <div aria-hidden className="blob bg-brand-300/40 w-[420px] h-[420px] -top-32 -right-20" />
        <div aria-hidden className="blob bg-brand-200/60 w-[520px] h-[520px] -bottom-48 -left-20" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 lg:pt-20 pb-24 lg:pb-32 grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <p className="eyebrow reveal">Proplan Klima &middot; Hranice</p>
            <h1
              className="reveal font-display mt-6 text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] text-brand-900"
              data-delay="80"
            >
              Projekce TZB
              <span className="block italic text-brand-600">na míru</span>
              pro Vaši nemovitost.
            </h1>
            <p className="reveal mt-7 max-w-xl text-lg text-brand-900/75 leading-relaxed" data-delay="160">
              Naší hlavní činností je projekce klimatizací, vzduchotechniky
              a tepelných čerpadel. Dodáváme čisté, technicky promyšlené
              návrhy — a postavíme je pro Vás i na klíč.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" data-delay="240">
              <Link href="/kontakt" className="btn btn-primary">
                Nezávazná poptávka <IconArrow width={18} height={18} />
              </Link>
              <Link href="/sluzby#projekce" className="btn btn-ghost">
                Projekce &amp; poradenství
              </Link>
            </div>

            <dl className="reveal mt-14 grid grid-cols-3 gap-6 max-w-xl border-t border-[var(--color-line)] pt-8" data-delay="320">
              <Stat number="5+" label="let zkušeností" />
              <Stat number="100+" label="realizací" />
              <Stat number="48 h" label="reakce na servis" />
            </dl>
          </div>

          <div className="relative reveal" data-delay="180">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-30px_rgba(59,42,31,0.45)]">
                <Image
                  src={HERO}
                  alt="Moderní interiér s klimatizací"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl px-5 py-4 shadow-[0_24px_50px_-20px_rgba(59,42,31,0.35)] border border-[var(--color-line)] float">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-600 font-semibold">Projekce</p>
                <p className="mt-1 font-display text-2xl text-brand-900">Návrh na míru</p>
              </div>
              <div className="absolute -top-5 -right-4 bg-brand-900 text-white rounded-2xl px-5 py-4 shadow-xl" style={{ animationDelay: "1s" }}>
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-300 font-semibold">Úspora</p>
                <p className="mt-1 font-display text-xl">až 70 % nákladů</p>
              </div>
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 hidden lg:flex items-center gap-3 bg-white rounded-full pl-3 pr-5 py-2 shadow-md border border-[var(--color-line)]">
                <span className="w-9 h-9 rounded-full bg-brand-100 grid place-items-center">
                  <Image src="/logo.png" alt="" width={1500} height={1000} className="h-6 w-auto" />
                </span>
                <span className="text-sm text-brand-900 font-medium">Certifikovaný partner</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-y border-[var(--color-line)] bg-white/60 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="marquee-track flex whitespace-nowrap py-5 text-brand-700/70 font-display text-xl tracking-[0.22em]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-12 px-6">
                  {["DAIKIN", "MITSUBISHI", "PANASONIC", "LG", "SAMSUNG", "TOSHIBA", "VAILLANT", "REGULUS", "GREE"].map(
                    (b) => (
                      <span key={b + i} className="flex items-center gap-12">
                        <span>{b}</span>
                        <span className="text-brand-400">◆</span>
                      </span>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED: PROJEKCE ========== */}
      <section className="py-24 lg:py-28 bg-paper-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative reveal">
              <div className="aspect-[5/6] relative rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-32px_rgba(59,42,31,0.4)]">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80"
                  alt="Projekce technického zařízení budov"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand-900 text-white rounded-2xl px-6 py-5 shadow-xl">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-300 font-semibold">Hlavní činnost</p>
                <p className="mt-1 font-display text-2xl">Projekce TZB</p>
              </div>
            </div>

            <div>
              <p className="eyebrow reveal">Co je naše srdce</p>
              <h2 className="reveal font-display text-4xl sm:text-5xl lg:text-6xl mt-5 text-brand-900 leading-[1.05]" data-delay="80">
                Projekce &amp; poradenství
                <span className="block italic text-brand-600">— hlavní činnost firmy.</span>
              </h2>
              <p className="reveal mt-6 text-lg text-brand-900/80 leading-relaxed" data-delay="160">
                Specializujeme se na projektování klimatizací, vzduchotechniky a
                tepelných čerpadel. Vytváříme kompletní projektovou dokumentaci
                pro novostavby, rekonstrukce i komerční stavby — od studie, přes
                DUR a DSP až po DPS s detailním rozpočtem.
              </p>
              <ul className="reveal mt-7 grid sm:grid-cols-2 gap-3" data-delay="200">
                {[
                  "Výpočet tepelných ztrát a zisků",
                  "Dokumentace DUR / DSP / DPS",
                  "Návrh klimatizace, VZT, vytápění",
                  "Energetická optimalizace",
                  "Spolupráce s architekty",
                  "Oponentury cizích projektů",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-brand-900/85">
                    <IconCheck width={20} height={20} className="text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-[0.95rem]">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="reveal mt-9 flex flex-wrap gap-3" data-delay="260">
                <Link href="/sluzby#projekce" className="btn btn-primary">
                  Detail služby <IconArrow width={18} height={18} />
                </Link>
                <Link href="/kontakt" className="btn btn-ghost">
                  Nezávazná poptávka
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="sluzby" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-end mb-16">
            <div>
              <p className="eyebrow reveal">Co děláme</p>
              <h2 className="reveal font-display text-4xl sm:text-5xl mt-5 text-brand-900" data-delay="80">
                Kompletní služby
                <span className="block italic text-brand-600">pod jednou střechou.</span>
              </h2>
            </div>
            <p className="reveal text-brand-900/70 text-lg lg:max-w-xl lg:justify-self-end leading-relaxed" data-delay="160">
              Od projekce — která je naším řemeslem — přes dodávku a instalaci
              až po dlouhodobý servis. Vždy s důrazem na detail, design a
              ekonomiku provozu.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <article
                key={s.slug}
                className={`card p-8 reveal group relative ${
                  s.featured ? "ring-2 ring-brand-600 lg:scale-[1.02]" : ""
                }`}
                data-delay={i * 80}
              >
                {s.featured && (
                  <span className="absolute -top-3 left-6 bg-brand-900 text-white text-[0.6rem] uppercase tracking-[0.22em] font-semibold px-3 py-1.5 rounded-full">
                    Hlavní činnost
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl grid place-items-center transition-colors ${
                  s.featured ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800 group-hover:bg-brand-200"
                }`}>
                  <s.icon width={28} height={28} />
                </div>
                <h3 className="font-display text-2xl mt-6 text-brand-900">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-600">{s.short}</p>
                <p className="mt-4 text-brand-900/75 leading-relaxed">{s.description}</p>
                <ul className="mt-5 space-y-2">
                  {s.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-brand-900/85">
                      <IconCheck width={18} height={18} className="text-brand-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/sluzby#${s.slug}`}
                  className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-brand-800 group-hover:text-brand-900"
                >
                  Více <IconArrow width={16} height={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROCESS WITH IMAGE ========== */}
      <section className="relative py-24 lg:py-32 bg-paper-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal relative">
            <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-32px_rgba(59,42,31,0.35)]">
              <Image
                src={PROCESS_IMG}
                alt="Náš pracovní postup"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-[var(--color-line)] max-w-[260px]">
              <p className="font-display text-3xl text-brand-900">Od A do Z</p>
              <p className="mt-2 text-sm text-brand-900/70">
                Projekce, realizace i servis. Jeden partner pro celý projekt.
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow reveal">Náš přístup</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-5 text-brand-900 reveal" data-delay="80">
              Rychlost, přesnost, <span className="italic text-brand-600">flexibilita</span>.
            </h2>
            <p className="mt-6 text-brand-900/75 leading-relaxed reveal" data-delay="120">
              Kombinujeme pokročilý počítačový design, udržitelné materiály a
              chytré technologie, abychom vytvořili prostory, které se
              přizpůsobují lidským potřebám.
            </p>

            <ol className="space-y-3 mt-10">
              {[
                { t: "Konzultace zdarma", d: "Probereme záměr, prostor a očekávání. Doporučíme nejvhodnější systém." },
                { t: "Návrh a projekt", d: "Připravíme řešení na míru, vizualizace a transparentní cenovou nabídku." },
                { t: "Realizace", d: "Profesionální instalace s respektem k interiéru a harmonogramu stavby." },
                { t: "Servis a péče", d: "Pravidelný servis i pohotovostní zásahy — jste v dobrých rukou." },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-5 bg-white border border-[var(--color-line)] rounded-2xl p-5 reveal hover:border-brand-300 transition-colors"
                  data-delay={i * 80}
                >
                  <span className="font-display text-3xl text-brand-500 w-10 shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-brand-900">{step.t}</h3>
                    <p className="mt-1 text-brand-900/75 text-sm leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <p className="eyebrow reveal">Realizace</p>
              <h2 className="reveal font-display text-4xl sm:text-5xl mt-5 text-brand-900" data-delay="80">
                Vybrané <span className="italic text-brand-600">projekty</span>
              </h2>
            </div>
            <Link href="/reference" className="btn btn-ghost reveal" data-delay="120">
              Všechny reference <IconArrow width={18} height={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GALLERY.map((g, i) => (
              <div
                key={g.label}
                className={`media reveal ${i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-square" : "aspect-[4/3]"}`}
                data-delay={i * 70}
              >
                <Image
                  src={g.src}
                  alt={g.label}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="media-caption">
                  <span className="font-medium">{g.label}</span>
                  <span className="text-brand-600 text-xs uppercase tracking-[0.18em] font-semibold whitespace-nowrap">
                    {g.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VALUES ========== */}
      <section className="py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow justify-center reveal">Proč Proplan Klima</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-5 text-brand-900 reveal" data-delay="80">
              Hodnoty, na kterých stavíme
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { t: "Projekce v DNA", d: "Projektování je naše hlavní řemeslo. Víme, jak má dobrá dokumentace vypadat — a podle toho i stavíme." },
              { t: "Design v detailu", d: "Technologie se musí do interiéru hodit. Skryté rozvody, čisté linie, promyšlené umístění." },
              { t: "Energetická úspora", d: "Volíme systémy s nejlepším poměrem investice, spotřeby a životnosti." },
              { t: "Vlastní tým", d: "Žádné subdodavatelské řetězce. Garantujeme kvalitu od projektu po předání." },
              { t: "Férová cena", d: "Transparentní rozpočet bez skrytých položek. Co slíbíme, to platí." },
              { t: "Záruka & servis", d: "Postaráme se o systém po celou jeho životnost." },
            ].map((v, i) => (
              <div key={v.t} className="card p-7 reveal" data-delay={i * 60}>
                <h3 className="font-display text-2xl text-brand-900">{v.t}</h3>
                <p className="mt-3 text-brand-900/75 leading-relaxed text-[0.95rem]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-4xl sm:text-5xl text-brand-900">{number}</dt>
      <dd className="text-[0.7rem] mt-1 uppercase tracking-[0.18em] text-brand-700 font-semibold">
        {label}
      </dd>
    </div>
  );
}
