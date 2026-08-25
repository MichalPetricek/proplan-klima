"use client";

import { useEffect, useState } from "react";
import { defaultContact, type SiteContact } from "@/lib/cms";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function ContactEditor() {
  const [contact, setContact] = useState<SiteContact>(defaultContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase
      .from("site_contacts")
      .select("*")
      .eq("id", "main")
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (data) setContact(data as SiteContact);
        if (loadError) setError(permissionMessage(loadError.message));
        setLoading(false);
      });
  }, []);

  function update<K extends keyof SiteContact>(key: K, value: SiteContact[K]) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setSaving(true);
    setMessage("");
    setError("");
    const { error: saveError } = await supabase
      .from("site_contacts")
      .upsert({ ...contact, id: "main", updated_at: new Date().toISOString() });

    if (saveError) setError(permissionMessage(saveError.message));
    else setMessage("Kontakty byly uloženy. Na webu se projeví po obnovení stránky.");
    setSaving(false);
  }

  if (loading) return <div className="admin-panel">Načítám kontakty…</div>;

  return (
    <form onSubmit={save} className="admin-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="admin-kicker">Veřejný web</p>
          <h2 className="admin-title">Kontaktní údaje</h2>
          <p className="text-sm text-brand-900/60 mt-2">
            Změny se propíšou do navigace, patičky a kontaktní stránky.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Ukládám…" : "Uložit změny"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <AdminField label="Název společnosti" value={contact.company_name} onChange={(value) => update("company_name", value)} />
        <AdminField label="E-mail" type="email" value={contact.email} onChange={(value) => update("email", value)} />
        <AdminField label="Telefon – zobrazení" value={contact.phone_display} onChange={(value) => update("phone_display", value)} hint="Např. +420 737 830 599" />
        <AdminField label="Telefon – odkaz" value={contact.phone_href} onChange={(value) => update("phone_href", value)} hint="Např. +420737830599" />
        <AdminTextarea label="Adresa kanceláře" value={contact.office_address} onChange={(value) => update("office_address", value)} />
        <AdminTextarea label="Adresa sídla" value={contact.registered_address} onChange={(value) => update("registered_address", value)} />
        <AdminField label="Otevírací doba Po–Pá" value={contact.opening_hours_weekdays} onChange={(value) => update("opening_hours_weekdays", value)} />
        <AdminField label="Otevírací doba So–Ne" value={contact.opening_hours_weekend} onChange={(value) => update("opening_hours_weekend", value)} />
        <div className="md:col-span-2">
          <AdminField label="Google Maps embed URL" type="url" value={contact.map_embed_url} onChange={(value) => update("map_embed_url", value)} />
        </div>
      </div>

      <Status message={message} error={error} />
    </form>
  );
}

function AdminField({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-medium text-brand-900">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="admin-input" />
      {hint && <span className="block text-xs text-brand-900/45 mt-1.5">{hint}</span>}
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-brand-900">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} required rows={3} className="admin-input resize-y" />
    </label>
  );
}

function Status({ message, error }: { message: string; error: string }) {
  return (
    <div className="mt-5 min-h-6" aria-live="polite">
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

function permissionMessage(message: string) {
  if (/row-level security|permission|policy/i.test(message)) {
    return "Tento účet nemá oprávnění správce. Přidejte jej do tabulky admin_users v Supabase.";
  }
  return `Data se nepodařilo načíst nebo uložit: ${message}`;
}
