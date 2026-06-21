import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { IconArrow } from "@/components/icons";

export const metadata = {
  title: "Reference",
  description:
    "Reference projekce TZB, klimatizací, tepelných čerpadel a vzduchotechniky od Proplan Klima - průběžně doplňujeme.",
};

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
            Portfolio dokončených projektů právě připravujeme. Mnoho z nich
            začínalo u nás projektem na papíře - a my k nim sbíráme podklady,
            abychom je sem mohli postupně doplňovat.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="card p-10 lg:p-14 text-center reveal">
            <p className="eyebrow justify-center">Připravujeme</p>
            <p className="font-display text-3xl text-brand-900 mt-4">
              Reference doplňujeme průběžně
            </p>
            <p className="mt-4 text-brand-900/75 leading-relaxed">
              Aktuálně sbíráme podklady z dokončených projektů, abychom je tu
              mohli zveřejnit i s fotkami a popisem řešení. Chcete vidět
              konkrétní příklady už teď? Rádi je ukážeme osobně.
            </p>
            <Link href="/kontakt" className="btn btn-primary mt-7">
              Ozvěte se nám <IconArrow width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
