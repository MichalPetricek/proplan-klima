import Link from "next/link";
import Image from "next/image";
import { services } from "@/components/services-data";
import { CTASection } from "@/components/CTASection";
import { IconCheck, IconArrow } from "@/components/icons";

export const metadata = {
  title: "Služby",
  description:
    "Projekce TZB, klimatizace, tepelná čerpadla, vzduchotechnika, realizace a servis — kompletní služby Proplan Klima.",
};

const serviceImages: Record<string, string> = {
  klimatizace:
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80",
  "tepelna-cerpadla":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  vzduchotechnika:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  projekce:
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=80",
  realizace:
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80",
  servis:
    "https://images.unsplash.com/photo-1581094651181-35942459ef62?auto=format&fit=crop&w=1200&q=80",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-paper pt-16 lg:pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="eyebrow reveal">Služby</p>
          <h1
            className="reveal font-display text-5xl sm:text-6xl lg:text-7xl text-brand-900 mt-5 max-w-4xl leading-[1.05]"
            data-delay="80"
          >
            Projekce TZB <span className="italic text-brand-600">na míru</span>
            <span className="block">— a celá realizace pod jednou střechou.</span>
          </h1>
          <p className="reveal mt-6 max-w-2xl text-lg text-brand-900/75" data-delay="160">
            Naší hlavní činností je projekce klimatizace, vzduchotechniky
            a tepelných čerpadel. K tomu nabízíme i dodávku, montáž a servis —
            takže celý projekt vede jeden partner.
          </p>

          <nav className="reveal mt-10 flex flex-wrap gap-2" data-delay="200">
            {services.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className={`text-xs uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors ${
                  s.featured
                    ? "bg-brand-900 text-white border-brand-900 hover:bg-brand-950"
                    : "bg-white border-[var(--color-line)] text-brand-800 hover:border-brand-400"
                }`}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-24">
          {services.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className={`scroll-mt-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center reveal ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                {s.featured && (
                  <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] font-semibold bg-brand-900 text-white px-3 py-1.5 rounded-full mb-5">
                    Hlavní činnost firmy
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl grid place-items-center ${
                  s.featured ? "bg-brand-800 text-white" : "bg-brand-100 text-brand-800"
                }`}>
                  <s.icon width={32} height={32} />
                </div>
                <h2 className={`font-display text-brand-900 mt-6 ${s.featured ? "text-5xl" : "text-4xl"}`}>
                  {s.title}
                </h2>
                <p className="mt-2 text-brand-600">{s.short}</p>
                <p className="mt-5 text-brand-900/80 leading-relaxed">{s.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-brand-900/85">
                      <IconCheck width={20} height={20} className="text-brand-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/kontakt" className="btn btn-primary">
                    Poptat službu <IconArrow width={18} height={18} />
                  </Link>
                  {s.featured && (
                    <Link href="/reference" className="btn btn-ghost">
                      Naše projekty
                    </Link>
                  )}
                </div>
              </div>

              <div className={`relative aspect-[5/4] rounded-3xl overflow-hidden shadow-[0_30px_60px_-30px_rgba(59,42,31,0.35)] ${
                s.featured ? "ring-4 ring-brand-200/60" : ""
              }`}>
                <Image
                  src={serviceImages[s.slug]}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
                {s.featured && (
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl px-5 py-4 border border-[var(--color-line)]">
                    <p className="text-[0.65rem] uppercase tracking-[0.22em] text-brand-600 font-semibold">Co dostanete</p>
                    <p className="mt-1 font-display text-xl text-brand-900">Kompletní projektovou dokumentaci pro stavbu i úřady</p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
