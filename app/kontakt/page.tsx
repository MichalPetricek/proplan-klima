import { ContactForm } from "@/components/ContactForm";
import { ContactDetails } from "@/components/ContactDetails";

export const metadata = {
  title: "Kontakt",
  description:
    "Kontaktujte Proplan Klima - Hranická 107, Hranice IV-Drahotuše, +420 737 830 599, info@proplan-klima.cz.",
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
          <ContactDetails />

          <div className="card card-flat p-8 lg:p-10">
            <p className="eyebrow">Nezávazná poptávka</p>
            <h2 className="font-display text-3xl text-brand-900 mt-3">Popište nám záměr</h2>
            <p className="mt-2 text-brand-900/70">
              Ať už řešíte projekt nové stavby, rekonstrukci nebo jen výměnu
              zdroje - ozveme se s návrhem dalšího postupu.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
