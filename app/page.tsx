import Link from "next/link";
import Image from "next/image";
import { services } from "@/components/services-data";
import { partners } from "@/components/partners-data";
import { CTASection } from "@/components/CTASection";
import { IconArrow, IconCheck } from "@/components/icons";
import { asset } from "@/lib/paths";

const HERO = asset("/drawings/vzt.svg");
const PROCESS_IMG = asset("/drawings/schema.svg");

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
              návrhy - a postavíme je pro Vás i na klíč.
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-3" data-delay="240">
              <Link href="/kontakt" className="btn btn-primary">
                Nezávazná poptávka <IconArrow width={18} height={18} />
              </Link>
              <Link href="/sluzby#projekce" className="btn btn-ghost">
                Projekce &amp; poradenství
              </Link>
            </div>
          </div>

          <div className="relative reveal" data-delay="180">
            <div className="relative aspect-[4/5]">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-30px_rgba(59,42,31,0.45)]">
                <Image
                  src={HERO}
                  alt="Výkres rozvodů vzduchotechniky"
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 via-transparent to-transparent" />
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
                  <Image src={asset("/logo.png")} alt="" width={1500} height={1000} unoptimized className="h-6 w-auto" />
                </span>
                <span className="text-sm text-brand-900 font-medium">Certifikovaný partner</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-y border-[var(--color-line)] bg-white/60 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="marquee-track flex items-center whitespace-nowrap py-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-16 px-8 shrink-0">
                  {partners.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.name + i}
                      src={asset(p.logo)}
                      alt={p.note ?? p.name}
                      title={p.note ?? p.name}
                      className="h-12 w-40 object-contain shrink-0"
                    />
                  ))}
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
                  src={asset("/drawings/heating.svg")}
                  alt="Výkres podlahového vytápění"
                  fill
                  unoptimized
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
                <span className="block italic text-brand-600">- hlavní činnost firmy.</span>
              </h2>
              <p className="reveal mt-6 text-lg text-brand-900/80 leading-relaxed" data-delay="160">
                Specializujeme se na projektování klimatizací, vzduchotechniky a
                tepelných čerpadel. Vytváříme kompletní projektovou dokumentaci
                pro novostavby, rekonstrukce i komerční stavby - od studie, přes
                DUR a DSP až po DPS s detailním rozpočtem.
              </p>
              <ul className="reveal mt-7 grid sm:grid-cols-2 gap-3" data-delay="200">
                {[
                  "Výpočet tepelných ztrát a zisků",
                  "Dokumentace DUR / DSP / DPS",
                  "Návrh klimatizace, VZT, vytápění",
                  "Energetická optimalizace",
                  "Spolupráce s architekty",
                  "Nezávislé technické poradenství",
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
              Těžištěm naší práce je projekce - od výpočtů a dokumentace až po
              odborný dozor. K tomu poradíme s výběrem techniky i realizace.
              Vždy s důrazem na detail, design a ekonomiku provozu.
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
                alt="Schéma zdroje tepla - technický výkres"
                fill
                unoptimized
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-[var(--color-line)] max-w-[260px]">
              <p className="font-display text-3xl text-brand-900">Od návrhu k dílu</p>
              <p className="mt-2 text-sm text-brand-900/70">
                Promyšlená projekce a odborný dozor až do realizace.
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
                { t: "Návrh a projekt", d: "Připravíme řešení na míru, projektovou dokumentaci a transparentní cenovou rozvahu." },
                { t: "Dozor při realizaci", d: "Předáme podklady prověřeným montážním partnerům a hlídáme soulad provedení s projektem." },
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
          </div>

          <div className="card p-10 lg:p-14 text-center max-w-3xl mx-auto reveal">
            <p className="font-display text-3xl text-brand-900">Reference právě připravujeme</p>
            <p className="mt-4 text-brand-900/75 leading-relaxed">
              Aktuálně sbíráme podklady z dokončených projektů, abychom je sem
              mohli postupně doplňovat a zveřejňovat. Ozvěte se nám - rádi
              ukážeme konkrétní řešení i osobně.
            </p>
            <Link href="/kontakt" className="btn btn-primary mt-7">
              Nezávazná poptávka <IconArrow width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
