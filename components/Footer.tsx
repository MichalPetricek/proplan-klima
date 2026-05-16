import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/paths";

export function Footer() {
  return (
    <footer className="bg-paper border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center">
            <Image
              src={asset("/logo.png")}
              alt="Proplan Klima"
              width={1500}
              height={1000}
              unoptimized
              className="h-16 w-auto"
            />
          </div>
          <p className="mt-6 max-w-md text-brand-900/70 leading-relaxed">
            Originální nápady a řešení. Projekce, návrh a realizace klimatizací,
            vzduchotechniky a tepelných čerpadel s důrazem na kvalitu, design
            a dlouhou životnost.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-700 mb-5">
            Navigace
          </h4>
          <ul className="space-y-3 text-brand-900/80">
            <li><Link href="/sluzby" className="hover:text-brand-900">Služby</Link></li>
            <li><Link href="/o-nas" className="hover:text-brand-900">O nás</Link></li>
            <li><Link href="/reference" className="hover:text-brand-900">Reference</Link></li>
            <li><Link href="/kontakt" className="hover:text-brand-900">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-brand-700 mb-5">
            Kontakt
          </h4>
          <ul className="space-y-3 text-brand-900/80">
            <li>
              <a href="mailto:info@proplan-klima.cz" className="hover:text-brand-900">
                info@proplan-klima.cz
              </a>
            </li>
            <li>
              <a href="tel:+420737830599" className="hover:text-brand-900">
                +420 737 830 599
              </a>
            </li>
            <li className="text-brand-900/70">
              Trávnická 787<br />
              Hranice I-Město, 753 01
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-brand-900/55">
          <p>© {new Date().getFullYear()} Proplan Klima. Všechna práva vyhrazena.</p>
          <p>Originální řešení pro Vaši nemovitost.</p>
        </div>
      </div>
    </footer>
  );
}
