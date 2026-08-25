"use client";

import { IconMail, IconPhone, IconPin, IconShield } from "@/components/icons";
import { useSiteContent } from "@/components/SiteContentProvider";

export function ContactDetails() {
  const { contact } = useSiteContent();

  return (
    <div className="space-y-4">
      <ContactCard
        icon={<IconPhone />}
        title="Telefon"
        value={contact.phone_display}
        href={`tel:${contact.phone_href}`}
      />
      <ContactCard
        icon={<IconMail />}
        title="E-mail"
        value={contact.email}
        href={`mailto:${contact.email}`}
      />
      <ContactCard
        icon={<IconPin />}
        title="Kancelář"
        value={contact.office_address}
      />
      <ContactCard
        icon={<IconShield />}
        title="Sídlo společnosti"
        value={contact.registered_address}
      />

      <div className="card card-flat p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-700">
          Otevírací doba
        </p>
        <ul className="mt-3 space-y-1.5 text-brand-900/85 text-sm">
          <li className="flex justify-between gap-4">
            <span>Po–Pá</span>
            <span className="font-medium">{contact.opening_hours_weekdays}</span>
          </li>
          <li className="flex justify-between gap-4 text-brand-900/60">
            <span>So–Ne</span>
            <span>{contact.opening_hours_weekend}</span>
          </li>
        </ul>
      </div>

      <div className="card card-flat overflow-hidden">
        <iframe
          title={`${contact.company_name} – mapa`}
          src={contact.map_embed_url}
          className="w-full aspect-[4/3] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
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
  const inner = (
    <div className="card card-flat p-6 flex items-start gap-4 hover:border-brand-300 transition-colors">
      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-800 grid place-items-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-brand-700">
          {title}
        </p>
        <p className="mt-1 text-brand-900 whitespace-pre-line font-medium">
          {value}
        </p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
