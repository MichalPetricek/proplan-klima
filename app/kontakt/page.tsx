import { ContactForm } from "@/components/ContactForm";
import { IconMail, IconPhone, IconPin } from "@/components/icons";

export const metadata = {
  title: "Kontakt",
  description:
    "Kontaktujte Proplan Klima — Trávnická 787, Hranice I-Město, +420 737 830 599, info@proplan-klima.cz.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-paper pt-16 lg:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="eyebrow reveal">Kontakt</p>
          <h1 className="reveal font-display text-5xl sm:text-6xl lg:text-7xl text-brand-900 mt-5 max-w-3xl leading-[1.05]" data-delay="80">
            Pojďme se domluvit na <span className="italic text-brand-600">Vašem projektu</span>.
          </h1>
          <p className="reveal mt-6 max-w-2xl text-lg text-brand-900/75" data-delay="160">
            Napište nám, zavolejte nebo vyplňte formulář. Ozveme se zpravidla
            do 24 hodin. Konzultace projekce je u nás zdarma.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.3fr] gap-12">
          <div className="space-y-4">
            <ContactCard
              icon={<IconPhone />}
              title="Telefon"
              value="+420 737 830 599"
              href="tel:+420737830599"
            />
            <ContactCard
              icon={<IconMail />}
              title="E-mail"
              value="info@proplan-klima.cz"
              href="mailto:info@proplan-klima.cz"
            />
            <ContactCard
              icon={<IconPin />}
              title="Adresa"
              value={`Trávnická 787\nHranice I-Město, 753 01`}
            />

            <div className="card p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-700">Otevírací doba</p>
              <ul className="mt-3 space-y-1.5 text-brand-900/85 text-sm">
                <li className="flex justify-between"><span>Po – Pá</span><span className="font-medium">8:00 – 17:00</span></li>
                <li className="flex justify-between"><span>So</span><span className="font-medium">po domluvě</span></li>
                <li className="flex justify-between text-brand-900/60"><span>Ne</span><span>zavřeno</span></li>
              </ul>
            </div>

            <div className="card overflow-hidden">
              <iframe
                title="Proplan Klima — mapa"
                src="https://www.google.com/maps?q=Tr%C3%A1vnick%C3%A1+787,+753+01+Hranice+I-M%C4%9Bsto&output=embed"
                className="w-full aspect-[4/3] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="card p-8 lg:p-10">
            <p className="eyebrow">Nezávazná poptávka</p>
            <h2 className="font-display text-3xl text-brand-900 mt-3">Popište nám záměr</h2>
            <p className="mt-2 text-brand-900/70">
              Ať už řešíte projekt nové stavby, rekonstrukci nebo jen výměnu
              zdroje — ozveme se s návrhem dalšího postupu.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const Inner = (
    <div className="card p-6 flex items-start gap-4 hover:border-brand-300 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-800 grid place-items-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-brand-700">{title}</p>
        <p className="mt-1 text-brand-900 whitespace-pre-line font-medium">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{Inner}</a> : Inner;
}
