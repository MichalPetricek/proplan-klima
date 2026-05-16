import Link from "next/link";

export function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="relative rounded-3xl bg-paper border border-[var(--border)] px-8 sm:px-14 py-16 overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-brand-300/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -left-20 -bottom-32 w-[28rem] h-[28rem] rounded-full bg-brand-200/60 blur-3xl"
          />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <p className="eyebrow reveal">Pojďme začít</p>
              <h2 className="font-display text-4xl sm:text-5xl mt-4 text-brand-900 reveal" data-delay="80">
                Plánujete novou stavbu nebo rekonstrukci?
              </h2>
              <p className="mt-5 text-brand-900/75 max-w-xl reveal" data-delay="160">
                Ozvěte se nám — připravíme návrh řešení na míru, projektovou
                dokumentaci i kompletní realizaci. Bez závazku a s férovou cenou.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <Link href="/kontakt" className="btn btn-primary">
                Poptat zdarma
              </Link>
              <a href="tel:+420737830599" className="btn btn-ghost">
                +420 737 830 599
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
